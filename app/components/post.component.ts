import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserModel } from '../models/user.model';
import { Http, Response } from '@angular/http';
import { UserService } from '../services/user.service';

@Component({
	selector:'post',
	template: `
		<div class="{{ color }}">
			<div class = "post-Info" style = "font-size: 8pt">
				<div class = "post-title" style = "float: left; font-weight: bold;">&nbsp;Title: {{post.title}}</div>
				<div class = "post-date" style = "float: left">&nbsp;Date-Posted: {{post.datetime}}</div>
				<div class = "post-pid" style = "float: left">&nbsp;PID: {{post.pid}}</div>
				<div class = "post-cid" style = "float: left">&nbsp;CID: {{post.cid}}</div>
				<div class = "post-uid" style = "float: left">&nbsp;UID: {{post.uid}}</div>
			</div>
	    <div class = "post-Body" style = "font-size: 12pt">
	    	<br>&nbsp;{{post.text}}
	    </div>  
	    <div class = "" style = "width: 100%;">
	    	<button (click)="upvote()" class = "blue lighten-0" style = "width: 30px;"><i class="fa fa-arrow-up " aria-hidden="true"></i></button>
	    	<span  style = "width: 33%;">&nbsp; Score: {{post.weight}} &nbsp;</span>
	    	<button (click)="downvote()" class = "blue lighten-0" style = "width: 30px;"><i class="fa fa-arrow-down blue lighten-0" aria-hidden="true"></i></button>
	    	<button class = "blue lighten-0" (click)="showPostCommentModal()" href = "">&nbsp;Add Comment</button>
	    </div>
	        <div *ngIf="postComment.length>0"  class="postComment">
	        	<div *ngFor="let pc of postComment" style="border-left-style:groove;">
    					<comment [comment]="pc" [post]="post"></comment>
    				</div>
    			</div>
    </div>
  <div *ngIf="showPopUpModal" class="modal open" style="z-index: 1003; display: block; opacity: 1; transform: scaleX(1); top: 10%;">
  	<div class="modal-content">
     	 <form class="col s12">
      	  <div class="row">
        			<textarea #textEntry rows="8" cols="60">Comment Goes Here</textarea>
        	</div>
      	</form>
  	</div>
  	<div class="modal-footer">
    	<div class = "closeButton" style = "float: left;">
      	<a href="javascript:void(0)" (click)="hidePostCommentModal()" class="modal-close waves-effect waves-green btn-flat">Close</a>
    	</div>
    	<div class = "closeButton" style = "float: right;">
      	<a href="javascript:void(0)" (click)="addComment(textEntry.value)" class="modal-close waves-effect waves-green btn-flat"><i class="material-icons prefix">input</i></a>
    	</div>
  	</div>
	</div>
	`
	,
	styles:[
	`
	.postComment{
		padding-left: 2cm;
	}
	`
	]
	})

export class PostComponent implements OnInit {
	commentURL: string;
	postComment: any;

	showPopUpModal: boolean;

	@Input()
	post: any;

	@Input()
	color: string;


	constructor(public http: Http, public userservice: UserService) { 
		this.commentURL = 'http://localhost/final/Database/forum.php';
		this.postComment = [];
		this.showPopUpModal = false;
	}
	deletePost(){
		console.log("Delete Post");
		this.http.delete(`${this.commentURL}/${this.post.cid}/${this.post.pid}`),{}
	}
	downvote(){
		console.log("downvote");
		this.http
		.put(`${this.commentURL}/${this.post.cid}/${this.post.pid}`,{downvote: true})
		.subscribe((res: Response)=>{
			//need to refresh posts
			this.refresh();
		});
	}
	upvote(){
		console.log("upvote");
		this.http.put(`${this.commentURL}/${this.post.cid}/${this.post.pid}`,{
			upvote: true
		}).subscribe((res: Response)=>{
			this.refresh();
		}, (err) => console.log(err));
	}
	showPostCommentModal(){
		this.showPopUpModal = true;
	}
	hidePostCommentModal(){
		this.showPopUpModal = false;
	}

	addComment(textEntryVal: string){
		this.userservice.getUser().subscribe((user: UserModel) => {
			this.http.post(`${this.commentURL}/${this.post.cid}/${this.post.pid}`,{
				text:textEntryVal,
				uid: user.UID,
				parentID: ""
			}).subscribe((res: Response)=>{
				this.hidePostCommentModal();
				this.refresh();
			}, (err) => console.log(err));
		});
	}

	ngOnInit() {
		this.refresh();
	}

	refresh() {
		this.http.get(`${this.commentURL}/${this.post.cid}/${this.post.pid}`).subscribe((res: Response) => {
			this.post	= res.json();
			this.postComment = this.post.comments;
		});
	}

}
