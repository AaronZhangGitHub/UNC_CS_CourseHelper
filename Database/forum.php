<?php
require_once('./orm.php');
$path=$_SERVER['REQUEST_URI'];
$path=substr($path, strpos($path, ".php")+4);
$path_components = explode('/', $path);

header('Access-Control-Allow-Origin: *');  
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == "GET") {
   if (sizeof($path_components)>=4 && $path_components[3]!=""&& $path_components[2]!=""&& $path_components[1]!="") {
      $coid= intval($path_components[3]);
      $comment = Comment::findByCOID($coid);

      if ($comment == null) {
        header("HTTP/1.0 404 Not Found");
        print("comment id: " . $coid . " not found.");
        exit();
      }

      header("Content-type: application/json");
      print($comment->getJSON());
      exit();
   }else if (sizeof($path_components)>=3 && $path_components[2]!=""&& $path_components[1]!="") {
      $pid= intval($path_components[2]);
      $post = Post::findByPID($pid);

      if ($post == null) {
        header("HTTP/1.0 404 Not Found");
        print("post id: " . $pid . " not found.");
        exit();
      }

      header("Content-type: application/json");
      print($post->getJSON());
      exit();
  }else if(sizeof($path_components)>=2 && $path_components[1]!=""){
      $cid= intval($path_components[1]);
      $posts = Post::findByCID($cid);

      if ($posts == null) {
        header("HTTP/1.0 404 Not Found");
        print("posts id: " . $cid . " not found.");
        exit();
      }

      header("Content-type: application/json");
      print($posts);
      exit();
  }
} else if ($_SERVER['REQUEST_METHOD'] == "POST") {
  if (sizeof($path_components)>=3 && $path_components[2]!=""&& $path_components[1]!="") {
      $pid= intval($path_components[2]);

      if ($post == null) {
        header("HTTP/1.0 404 Not Found");
        print("post id: " . $pid . " not found.");
        exit();
      }

      if (!isset($_REQUEST['uid'])) {
        header("HTTP/1.0 400 Bad Request");
        print("Missing user");
        exit();
      }
      
      $uid = trim($_REQUEST['uid']);
      if ($uid == "") {
        header("HTTP/1.0 400 Bad Request");
        print("Bad user");
        exit();
      }

      if (!isset($_REQUEST['text'])) {
        header("HTTP/1.0 400 Bad Request");
        print("Missing text");
        exit();
      }
      
      $text = trim($_REQUEST['text']);
      if ($text == "") {
        header("HTTP/1.0 400 Bad Request");
        print("Bad text");
        exit();
      }

      if (!isset($_REQUEST['parentID'])) {
        header("HTTP/1.0 400 Bad Request");
        print("Missing parentID");
        exit();
      }
      
      $datetime= date('m/d/Y h:i:s a');
      $weight = 1;
      $parentID = trim($_REQUEST['parentID']);

      $new_comment = Comment::create($pid, $uid, $text, $datetime, $weight, $parentID);

      if ($new_comment == null) {
        header("HTTP/1.0 500 Server Error");
        print("Server couldn't create new comment.");
        exit();
      }
      
      header("Content-type: application/json");
      print($new_comment->getJSON());
      exit();
  }if(sizeof($path_components)>=2 && $path_components[1]!=""){
      $cid= intval($path_components[1]);
    
      if (!isset($_REQUEST['uid'])) {
        header("HTTP/1.0 400 Bad Request");
        print("Missing user");
        exit();
      }
      
      $uid = trim($_REQUEST['uid']);
      if ($uid == "") {
        header("HTTP/1.0 400 Bad Request");
        print("Bad user");
        exit();
      }

      if (!isset($_REQUEST['title'])) {
        header("HTTP/1.0 400 Bad Request");
        print("Missing title");
        exit();
      }
      
      $title = trim($_REQUEST['title']);
      if ($title == "") {
        header("HTTP/1.0 400 Bad Request");
        print("Bad title");
        exit();
      }

      if (!isset($_REQUEST['text'])) {
        header("HTTP/1.0 400 Bad Request");
        print("Missing text");
        exit();
      }
      
      $text = trim($_REQUEST['text']);
      if ($text == "") {
        header("HTTP/1.0 400 Bad Request");
        print("Bad text");
        exit();
      }
      
      $datetime= date('m/d/Y h:i:s a');
      $weight = 1;

      $new_post = Post::create($cid, $uid, $title, $text, $datetime, $weight);

      if ($new_todo == null) {
        header("HTTP/1.0 500 Server Error");
        print("Server couldn't create new post.");
        exit();
      }
      
      header("Content-type: application/json");
      print($new_post->getJSON());
      exit();
    }
} else if ($_SERVER['REQUEST_METHOD'] == "PUT") {
    //updating comment
  if (sizeof($path_components)>=4 && $path_components[3]!=""&& $path_components[2]!=""&& $path_components[1]!="") {
      $coid= intval($path_components[3]);
      $comment = Comment::findByCOID($coid);

      if ($comment == null) {
        header("HTTP/1.0 404 Not Found");
        print("comment id: " . $coid . " not found.");
        exit();
      }
      
      $upvote=false;
      if(isset($_REQUEST['upvote'])){
          $upvote=trim($_REQUEST['upvote']);
      }

      if($upvote){
          $comment->upvoteComment();
          print($comment->getJSON());
          exit();
      }

      $downvote=false;
      if(isset($_REQUEST['downvote'])){
          $downvote=trim($_REQUEST['downvote']);
      }

      if($downvote){
          $comment->downvoteComment();
          print($comment->getJSON());
          exit();
      }

      $newText = false;
      if (isset($_REQUEST['text'])) {
        $newText = trim($_REQUEST['text']);
      }

      if ($newText != false) {
        $comment->setText($newText);
        $time= date('m/d/Y h:i:s a');
        $comment->setDatetime($time);
        print($comment->getJSON());
      }
      exit();

   //updating post   
   }else if (sizeof($path_components)>=3 && $path_components[2]!=""&& $path_components[1]!="") {
      $pid= intval($path_components[2]);
      $post = Post::findByPID($pid);

      if ($post == null) {
        header("HTTP/1.0 404 Not Found");
        print("post id: " . $pid . " not found.");
        exit();
      }

      $upvote=false;
      if(isset($_REQUEST['upvote'])){
          $upvote=trim($_REQUEST['upvote']);
      }

      if($upvote){
          $post->upvotePost();
          print($post->getJSON());
          exit();
      }

      $downvote=false;
      if(isset($_REQUEST['downvote'])){
          $downvote=trim($_REQUEST['downvote']);
      }

      if($downvote){
          $post->downvotePost();
          print($post->getJSON());
          exit();
      }

      $newText = false;
      if (isset($_REQUEST['text'])) {
        $newText = trim($_REQUEST['text']);
      }

      if ($newText != false) {
        $post->setText($newText);
        $time= date('m/d/Y h:i:s a');
        $post->setDatetime($time);
        print($post->getJSON());
      }

      exit();
  }
}else if ($_SERVER['REQUEST_METHOD'] == "Delete") {
  if (sizeof($path_components)>=4 && $path_components[3]!=""&& $path_components[2]!=""&& $path_components[1]!="") {
      $coid= intval($path_components[3]);
      $comment = Comment::findByCOID($coid);

      if ($comment == null) {
        header("HTTP/1.0 404 Not Found");
        print("comment id: " . $coid . " not found.");
        exit();
      }

      $comment->deleteComment();
      exit();
   }else if (sizeof($path_components)>=3 && $path_components[2]!=""&& $path_components[1]!="") {
      $pid= intval($path_components[2]);
      $post = Post::findByPID($pid);

      if ($post == null) {
        header("HTTP/1.0 404 Not Found");
        print("post id: " . $pid . " not found.");
        exit();
      }

      $post->deletePost();
      exit();
  }
}

