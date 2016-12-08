import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserModel } from '../models/user.model';
import { Http, Response } from '@angular/http';
import { UserService } from '../services/user.service';

var $ = (window as any).$ || {};
var Materialize = (window as any).Materialize || {};

@Component({
	selector:'formPage',
	template: `
	<div *ngIf = "posts.size!==0" >
		<div *ngFor="let post of posts" class = "post-container" style = "width: 100%;" >
			<post [post]="post" [color]="'blue lighten-0'"></post>
		</div>
	</div>
	<div *ngIf = "posts.length==0">
		<p>No Posts to Show</p>
	</div>
	<br>
  	<div id="createPostModal" style="position: absolute; z-index: 100" class="modal bottom-sheet">
	  	<div class="modal-content">
	 	 	<form class="col s12">
	 	 		<div class="row">
	        	  	<div class="input-field col s6">
			          <input #postTitle id="createPostTitle" type="text">
			          <label for="createPostTitle">Post title</label>
		        	</div>
		        </div>
	      	  	<div class="row">
	        	  	<div class="input-field col s6">
			          <textarea #textEntry id="createPostBody" class="materialize-textarea"></textarea>
			          <label for="createPostBody">Post body</label>
		        	</div>
		        </div>
	      	</form>
	  	</div>
	  	<div class="modal-footer">
	      	<a (click)="hideCreatePostModal()" class="left modal-close waves-effect waves-green btn-flat">Close</a>
	      	<a (click)="postPost(postTitle.value, textEntry.value)" class="left modal-close waves-effect waves-green btn-flat">Submit</a>
	  	</div>
	</div>

	<div class="fixed-action-btn">
    	<a (click)="showCreatePostModal()" class="btn-floating btn-large red">
      		<i class="large material-icons">mode_edit</i>
   		</a>
  </div>

	`
})
export class FormComponent implements AfterViewInit {
	commentURL: string;
	posts: any;
	showPopUpModal: boolean;

	
	private _cid: number;

	@Input()
	set cid(cid: number) {
		this._cid = cid;
		if (cid !== null) {
			this.loadPosts();
		}
	}

	@Input()
	course: any;

	get cid() {
		return this._cid;
	}
	getCourse(){
		return this.course;
	}

	constructor(public http: Http, public userservice: UserService){
		this.commentURL = 'http://localhost/final/Database/forum.php';
		this.posts = [];
		this.showPopUpModal = false;
	}

	showCreatePostModal(){
		$("#createPostModal").modal('open');
		$("#createPostTitle").val("");
		$("#createPostBody").val("");
	}
	hideCreatePostModal(){
		$("#createPostModal").modal('close');
	}

	loadPosts() {
		this.http.get(`${this.commentURL}/${this.cid}`).subscribe((res: Response) => {
			this.posts	= res.json();
		});
	}
	censorship(inputString: string){
		var outPutString = "";
		var replacementPhrases = ["is cool", "your hair is shiny", "your teeth are very hard", "love", "is awesome", "cool","awesome", "you look like you could bear children well","if it came down to you or another person life or death situation I would choose you","is amazing","I love you in spite of your music taste","you could be a part time model","I don't want to vomit when I look at you"];
		//Array of bad words taken from following URL: http://codewithdesign.com/2011/05/20/php-array-of-bad-words/
		var badWords = ["quit", , "horrid","terrible","suck","sucks","fuck","fucking","motherfuck","motherfucker","shit","ballsack","scroutum","hell",'fuck', 'shit', 'asshole', 'cunt', 'fag', 'fuk', 'fck', 'fcuk', 'assfuck', 'assfucker', 'fucker',
                                'motherfucker', 'asscock', 'asshead', 'asslicker', 'asslick', 'asssucker', 'bastard', 'bitch', 'bitchtits',
                                'bitches', 'bitch', 'brotherfucker', 'bullshit', 'bumblefuck', 'buttfucka', 'fucka', 'buttfucker', 'buttfucka', 'fatass', 'fuckoff', 'fuckstick', 'fucktard', 'fuckwad', 'fuckwit', 'dick',
                                'dickfuck', 'dickhead', 'dickjuice', 'dickmilk', 'doochbag', 'douchebag', 'douche', 'dickweed', 'dyke', 'dumbass', 'dumass',
                                'fuckboy', 'fuckbag', 'piss', 'prick', 'pussy',
                                'poontang', 'poonany', 'porchmonkey','porch monkey', 'poon', 'queer', 'queerbait', 'queerhole', 'queef', 'renob', 'rimjob', 'ruski',
                                'schlong', 'shitass', 'shitbag', 'shitbagger', 'shitbreath', 'choad', 'clitface'
                                , 'clusterfuck', 'cockass', 'cockbite', 'cockface', 'skank', 'skeet', 'skullfuck', 'slut', 'slutbag', 'splooge', 'twatlips', 'twat',
                                'twats', 'twatwaffle', 'vaj', 'vajayjay', 'va-j-j', 'wank', 'wankjob', 'whore', 'whorebag', 'whoreface'];
    var inputSplitBySpace = inputString.split(' ');
    for(var x in inputSplitBySpace){
    	for(var y in badWords){
    		if(inputSplitBySpace[x].toUpperCase()===badWords[y].toUpperCase()){
    			//replace with something from replacement phrases
    			var replacementPhraseIndex = Math.floor(Math.random()*(replacementPhrases.length+1));
    			inputSplitBySpace[x]=replacementPhrases[replacementPhraseIndex];
    			break;
    		}
    	}
    }
    var toString = inputSplitBySpace.toString();
    console.log(toString);
    outPutString = toString.replace(/,/g , " ");
    return outPutString;
	}
	postPost(pt: string, te: string){
		if(pt==="" || te ===""){
			//do nothing
		}else{
			pt = this.censorship(pt);
			te = this.censorship(te);
			console.log(pt);
			console.log(te);
			this.userservice.getUser().subscribe((user: UserModel) => {
				this.http.post(`${this.commentURL}/${this.cid}`,{
					uid: user.UID,
					title: pt,
					text: te
				}).subscribe((res: Response) => {
						console.log(res)
						this.hideCreatePostModal();
						this.loadPosts();
					}, (err) => console.log(err));
				});
		}
	}

	ngAfterViewInit() {
		$(".modal").modal();
	}
}
