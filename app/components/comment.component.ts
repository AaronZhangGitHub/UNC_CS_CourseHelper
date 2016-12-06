import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { Http, Response } from '@angular/http';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';

@Component({
	selector:'comment',
	template: `
			<div class = "post-Info" style = "font-size: 8pt">
				<div class = "post-date" style = "float: left">&nbsp;Date-Posted: {{comment.datetime}}</div>
				<div class = "post-pid" style = "float: left">&nbsp;PID: {{comment.pid}}</div>
				<div class = "post-cid" style = "float: left">&nbsp;CID: {{comment.cid}}</div>
				<div class = "post-uid" style = "float: left">&nbsp;UID: {{comment.uid}}</div>
				<div class = "post-ParentID" style = "float: left">&nbsp;parentID: {{comment.parentID}}</div>
			</div>
	    <div class = "post-Body" style = "font-size: 12pt">
	    	<br>&nbsp;{{comment.text}}
	    </div>  
	    <div class = "" style = "width: 100%;">
	    	<button (click)="upvote()" class = "blue lighten-0" style = "width: 30px;"><i class="fa fa-arrow-up " aria-hidden="true"></i></button>
	    	<span  style = "width: 33%;">&nbsp; Score: {{comment.weight}} &nbsp;</span>
	    	<button (click)="downvote()" class = "blue lighten-0" style = "width: 30px;"><i class="fa fa-arrow-down blue lighten-0" aria-hidden="true"></i></button>
	    	<button class = "blue lighten-0" (click)="showPostCommentModal()" href = "">&nbsp;Reply</button>
	    	<div *ngIf="replies.length>0"  class="postComment">
	        <div *ngFor="let rep of replies" style="border-left-style:groove;">
	        <p>{{rep|json}}</p>
    				<comment [comment]="rep" [post]="post"></comment>
    			</div>
    		</div>
	    </div>
			<div *ngIf="showPopUpModal" class="modal open" style="z-index: 1003; display: block; opacity: 1; transform: scaleX(1); top: 10%;">
				<div class="modal-content">
				 	 <form class="col s12">
				  	  <div class="row">
				    			<textarea #textEntry rows="8" cols="60">Reply Goes Here</textarea>
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
	`]
})

export class CommentComponent  {
	URL: string;
	thisComment: any;
	replies: any;
	showPopUpModal: boolean;

	@Input()
	comment:any;

	@Input()
	post:any;

	constructor(private http: Http, public userservice: UserService) {
		this.URL = 'http://localhost/final/Database/forum.php';
		this.replies = [];
		this.showPopUpModal = false;
		//console.log("c: "+ this.comment);
	 }
	showPostCommentModal(){
		this.showPopUpModal = true;
	}
	hidePostCommentModal(){
		this.showPopUpModal = false;
	}
	downvote(){
		console.log("downvote");
		this.http
		.put(`${this.URL}/${this.post.cid}/${this.post.pid}/${this.comment.coid}`,{downvote: true})
		.subscribe((res: Response)=>{
			//need to refresh posts
			this.refresh();
		});
	}
	upvote(){
		console.log(this.comment.coid);
		this.http.put(`${this.URL}/${this.post.cid}/${this.post.pid}/${this.comment.coid}`,{
			upvote: true
		}).subscribe((res: Response)=>{
			this.refresh();
		}, (err) => console.log(err));
	}
	addComment(textEntryVal: string){
		console.log(textEntryVal);
		console.log(this.comment.coid);
		this.userservice.getUser().subscribe((user: UserModel) => {
			this.http.post(`${this.URL}/${this.post.cid}/${this.post.pid}/${this.comment.coid}`,{
				text:textEntryVal,
				uid: user.UID,
				parentID: ""
			}).subscribe((res: Response)=>{
				console.log(res);
				this.hidePostCommentModal();
				this.refresh();
			}, (err) => console.log(err));
		});
	}
	ngOnInit() {
		this.refresh();
	}
	refresh(){
			//console.log(this.comment.coid);
			this.http.get(`${this.URL}/${this.post.cid}/${this.post.pid}/${this.comment.coid}`).subscribe((res: Response) => {
			//console.log(this.comment.coid);
			//console.log(res);
			this.comment	= res.json();
			//console.log(this.comment);
			//console.log(this.replies);
			this.replies= this.comment.replies;
			//console.log(this.replies);
		});
	}
}
