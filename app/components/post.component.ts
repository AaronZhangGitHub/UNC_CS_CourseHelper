import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
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
	    	<button class = "blue lighten-0" (click)="addComment" href = "">&nbsp;Add Comment</button>
	    </div>
	        <div *ngIf="postComment.length>0"  class="postComment">
	        	<div *ngFor="let pc of postComment" style="border-left-style:groove;">
    					<comment [comment]="pc" [post]="post"></comment>
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
	thispost: any;
	@Input()
	post: any;

	@Input()
	color: string;


	constructor(public http: Http) { 
		this.commentURL = 'http://localhost/final/Database/forum.php';
		this.postComment = [];
	}
	downvote(){
		console.log("downvote");
		alert("downvote");
		this.http
		.put(`${this.commentURL}/${this.post.cid}/${this.post.pid}`,{upvote: true})
		.subscribe((res: Response)=>{
			//refresh page
		});
	}

	upvote(){
		console.log("upvote");
		alert("Upvote");
		this.http.put(`${this.commentURL}/${this.post.cid}/${this.post.pid}`,{
			downvote: true
		}).subscribe((res: Response)=>{
			//refresh page
		});
	}


	addComment(){
		console.log("addc");
	}

	ngOnInit() {
		this.http.get(`${this.commentURL}/${this.post.cid}/${this.post.pid}`).subscribe((res: Response) => {
			this.thispost	= res.json();
			this.postComment = this.thispost.comments;
		});
	}

}
