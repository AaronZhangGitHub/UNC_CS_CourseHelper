<?PHP

date_default_timezone_set('America/New_York');

class Post{

    private $pid;
    private $cid;
    private $uid;
    private $title;
    private $text;
    private $datetime;
    private $weight;
    private $com;
    private $username;

    private function __construct($pid, $cid, $uid, $title, $text, $datetime,$weight, $com, $username) {
        $this->pid = $pid;
        $this->cid = $cid;
        $this->uid = $uid;
        $this->title = $title;
        $this->text = $text;
        $this->datetime = $datetime;
        $this->weight = $weight;
        $this->com = $com;
        $this->username = $username;
    }

    public static function connect() {
      return new SQLite3('../server/websiteDatabase.db');
    }

    public static function findByCID($cid){
      if($cid>47){
        return "No class with cid '$cid'";
      }
      $conn= Post::connect();
      $result = $conn->query("select * from Post p where p.cid='$cid' ORDER BY p.weight DESC, p.Datetime DESC");
      $posts=array();

      if ($result) {
        while ($next_row = $result->fetchArray()) {
            $username=Comment::findUsername($next_row[2]);
            $post=array('username'=>$username, 'pid'=> $next_row[0], 'cid'=> $next_row[1], 'uid'=> $next_row[2], 'title'=> $next_row[3],
                          'text'=> $next_row[4], 'datetime'=> $next_row[5], 'weight'=>$next_row[6]) ;
            $posts[]=$post;
        }
      }
      return json_encode($posts, JSON_PRETTY_PRINT);
    }

    public static function findByPID($pid){
      $conn= Post::connect();
      $postResult = $conn->query("select * from Post p where p.pid='$pid'");
      $page=array('post'=>"");
      $post=array();
      while ($next_row = $postResult->fetchArray()) {
            $post=array('pid'=> $next_row[0], 'cid'=> $next_row[1], 'uid'=> $next_row[2], 'title'=> $next_row[3],
                          'text'=> $next_row[4], 'datetime'=> $next_row[5], 'weight'=>$next_row[6]) ;
            $page['post']=$post;
      }if($page['post']==""){return null;}

      $commentResult = $conn->query("select * from Comment c where c.pid='$pid' Order by c.weight DESC, c.Datetime DESC");
      $comments=array();
      $childComments=Comment::childCommentIDS();
      while ($next_row = $commentResult->fetchArray()) {
            if(in_array($next_row[0], $childComments)){
              continue;
            }
            $username=Comment::findUsername($next_row[2]);
            $comment=array('username'=>$username, 'coid'=> $next_row[0], 'pid'=> $next_row[1], 'uid'=> $next_row[2], 'text'=> $next_row[3],
                          'datetime'=> $next_row[4], 'weight'=> $next_row[5]);
            $replies=Comment::findChildren($next_row[0]);
            $comment["replies"]=$replies;
            $comments[]=$comment;
      }
      $page['comments']=$comments;
      $username=Comment::findUsername($post['uid']);
      return new Post($post['pid'],
                          $post['cid'],
                          $post['uid'],
                          $post['title'],
                          $post['text'],
                          $post['datetime'],
                          $post['weight'],
                          $comments,
                          $username);
    }

    public function getJSON() {
    $json_obj = array('username'=>$this->username,
          'pid' => $this->pid,
          'cid' => $this->cid,
          'uid' => $this->uid,
          'title'=> $this->title,
          'text'=> $this->text,
          'datetime'=> $this->datetime,
          'weight'=> $this->weight,
          'comments'=> $this->com);
    return json_encode($json_obj, JSON_PRETTY_PRINT);
  }

  public function setText($text) {
    $this->text = $text;
    return $this->update();
  }

  public function setDatetime($datetime){
    $this->datetime = $datetime;
    return $this->update();
  }

  private function update() {
      $conn= Post::connect();

      $result = $conn->query("update Post set " .
             "text='" . SQLite3::escapeString($this->text) . "', " .
             "datetime='" . $this->datetime . "', " .
             "weight=" . $this->weight . 
             " where pid=" . $this->pid);
      return $result;
  }

  public static function create($cid, $uid, $title, $text, $datetime, $weight) {
      $conn= Post::connect();
      $result = $conn->query("insert into Post(cid, uid, title, text, datetime, weight) values (" .
            $cid . ", " .
            $uid . ", " .
            "'" . SQLite3::escapeString($title) . "', " .
            "'" . SQLite3::escapeString($text) . "', " .
            "'" . $datetime. "', " .
            $weight.")");
      $username=Comment::findUsername($uid);
      if ($result) {
        $pid = $conn->lastInsertRowID();
        $com=array();
        return new Post($pid,$cid, $uid, $title, $text, $datetime, $weight, $com, $username);
      }
      return null;
  }

  public function setWeight($weight){
    $this->weight = $weight;
    return $this->update();
  }

  public function upvotePost(){
    $updatedWeight= $this->weight;
    $this->setWeight($updatedWeight+1);
  }

  public function downvotePost(){
    $updatedWeight= $this->weight;
    $this->setWeight($updatedWeight-1);
  }

  public function deletePost(){
      $conn = Post::connect();
      $conn->query("delete from Post where pid = " . $this->pid);
  }
}

class Comment{

    private $coid;
    private $pid;
    private $uid;
    private $text;
    private $datetime;
    private $weight;
    private $reply;
    private $username;

    private function __construct($coid, $pid, $uid, $text, $datetime,$weight, $reply, $username) {
        $this->coid = $coid;
        $this->pid = $pid;
        $this->uid = $uid;
        $this->text = $text;
        $this->datetime = $datetime;
        $this->weight = $weight;
        $this->reply = $reply;
        $this->username = $username;
    }


    public static function connect() {
        return new SQLite3('../server/websiteDatabase.db');
    }

    public static function findByCOID($coid){
        $conn= Comment::connect();
        $commentResult = $conn->query("select * from Comment c where c.CoID='$coid'");
        $comment=array();
        while ($next_row = $commentResult->fetchArray()) {
              $comment=array('coid'=> $next_row[0], 'pid'=> $next_row[1], 'uid'=> $next_row[2], 'text'=> $next_row[3],
                            'datetime'=> $next_row[4], 'weight'=> $next_row[5]);
              $replies=Comment::findChildren($next_row[0]);
              $comment["replies"]=$replies;
        }
        $username=Comment::findUsername($comment['uid']);
        return new Comment($comment['coid'],
                          $comment['pid'],
                          $comment['uid'],
                          $comment['text'],
                          $comment['datetime'],
                          $comment['weight'],
                          $comment['replies'],
                          $username);
    }

    public static function findChildren($CoID){
        $conn= Comment::connect();
        $childResult = $conn->query("select * from CommentHierarchy ch, Comment c where ch.comment='$CoID' AND c.CoID=ch.Child Order by c.weight DESC, c.Datetime DESC");
        $reply=array();
        $comments=0;
        while ($next_row = $childResult->fetchArray()) {
              $comments++;
              $username=Comment::findUsername($next_row[4]);
              $child=array('username'=>$username, 'coid'=> $next_row[2], 'pid'=> $next_row[3], 'uid'=> $next_row[4], 'text'=> $next_row[5],
                            'datetime'=> $next_row[6], 'weight'=> $next_row[7]) ;
              $nestedChildren = Comment::findChildren($next_row[1]);
              $childComments[]=$next_row[2];
              $child['replies']=$nestedChildren;
              $reply[]=$child;
        }
        if($comments==0){
          print "";
        }
        return $reply;
    }

    public static function findUsername($uid){
        $conn= Comment::connect();
        $userResult = $conn->query("select u.username from User u where u.uid='$uid' ");
        $username="";
        while ($next_row = $userResult->fetchArray()) {
              $username=$next_row[0];
        }
        return $username;
    }
    public static function childCommentIDS(){
        $conn= Comment::connect();
        $childResult = $conn->query("select c.CoID from comment c where c.CoID in (Select ch.Child from CommentHierarchy ch)");
        $childIDS=array();
        while ($next_row = $childResult->fetchArray()) {
              $childIDS[]=$next_row[0];
        }
        return $childIDS;
    }

    public function getJSON() {
    $json_obj = array('username'=>$this->username,
          'coid' => $this->coid,
          'pid' => $this->pid,
          'uid' => $this->uid,
          'text'=> $this->text,
          'datetime'=> $this->datetime,
          'weight'=> $this->weight,
          'replies'=> $this->reply);
    return json_encode($json_obj, JSON_PRETTY_PRINT);
  }

  public function setText($text) {
    $this->text = $text;
    return $this->update();
  }

  public function setDatetime($datetime){
    $this->datetime = $datetime;
    return $this->update();
  }

  private function update() {
      $conn= Comment::connect();

      $result = $conn->query("update Comment set " .
             "text='" . SQLite3::escapeString($this->text) . "', " .
             "datetime='" . $this->datetime . "', " .
             "weight=" . $this->weight . 
             " where CoID=" . $this->coid);
      return $result;
  }

  public static function create($pid, $uid, $text, $datetime, $weight, $parentID, $cid) {
      $conn= Comment::connect();
      $result = $conn->query("insert into Comment(pid, uid, text, datetime, weight) values (" .
            $pid . ", " .
            $uid . ", " .
            "'" . SQLite3::escapeString($text) . "', " .
            "'" . $datetime. "', " .
            $weight.")");
      $username=Comment::findUsername($uid);    
      if ($result) {
        $coid = $conn->lastInsertRowID();
        $reply=array();

        if($parentID!=""){
          $conn->query("insert into CommentHierarchy values (" .
              $parentID . ", " .
              $coid . ")");

          $uidResult=$conn->query("Select c.uid from Comment c where c.CoID='$parentID'");
          $postuidResult=$conn->query("Select p.uid from Post p where p.pid='$pid'");
          $puid = $uidResult->fetchArray();
          $postuid = $postuidResult->fetchArray();
          // Comment::notifyUser($puid[0], false, $cid, $pid);
          // Comment::notifyUser($postuid[0], true, $cid, $pid);
        }
        return new Comment($coid, $pid,$uid, $text, $datetime, $weight, $reply, $username);
      }
      return null;
  }

  public function setWeight($weight){
    $this->weight = $weight;
    return $this->update();
  }
  
  public function upvoteComment(){
    $updatedWeight= $this->weight;
    $this->setWeight($updatedWeight+1);
  }

  public function downvoteComment(){
    $updatedWeight= $this->weight;
    $this->setWeight($updatedWeight-1);
  }

  public function deleteComment(){
      $conn = Comment::connect();
      $conn->query("delete from Comment where CoID = " . $this->coid);
  }

  public static function notifyUser($uid, $post, $cid, $pid){
      if($post){$message="post";}
      else{$message="comment";}
      $url = 'http://localhost:8080';
      $href= 'http://localhost/$cid/$pid';
      $data = array('user' => '$uid', 'message' => '<a href=$href>Someone has replied to your '.$message .'</a>');
          $options = array(
              'http' => array(
                  'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                  'method'  => 'POST',
                  'content' => http_build_query($data)
              )
          );
          $context  = stream_context_create($options);
          $result = file_get_contents($url, false, $context);
          if ($result === FALSE) {}
  }
}
?>
