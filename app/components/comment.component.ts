import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { Http, Response } from '@angular/http';
import { UserService } from '../services/user.service';

@Component({
	selector:'comment',
	template: `
			<div class = "post-Info" style = "font-size: 8pt">
				<div class = "post-date" style = "float: left">&nbsp;Date-Posted: {{comment.datetime}}</div>
				<div class = "post-pid" style = "float: left">&nbsp;PID: {{comment.pid}}</div>
				<div class = "post-cid" style = "float: left">&nbsp;CID: {{comment.cid}}</div>
				<div class = "post-uid" style = "float: left">&nbsp;UID: {{comment.uid}}</div>
			</div>
	    <div class = "post-Body" style = "font-size: 12pt">
	    	<br>&nbsp;{{comment.text}}
	    </div>  
	    <div class = "" style = "width: 100%;">
	    	<span style = "width: 33%;"><i class="fa fa-arrow-up" aria-hidden="true"></i></span>
	    	<span style = "width: 33%;">&nbsp; Score: {{comment.weight}} &nbsp;</span>
	    	<span style = "width: 33%;"><i class="fa fa-arrow-down" aria-hidden="true"></i></span>
	    	<a href = "">&nbsp;Add Comment</a>
	    	<div *ngIf="replies.length>0"  class="postComment">
	        <div *ngFor="let rep of replies" style="border-left-style:groove;">
    				<comment [comment]="rep" [post]="post"></comment>
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
	@Input()
	comment:any;

	@Input()
	post:any;

	constructor(private http: Http) {
		this.URL = 'http://localhost/final/Database/forum.php';
		this.replies = [];
	 }
	ngOnInit() {
		this.http.get(`${this.URL}/${this.post.cid}/${this.post.pid}/${this.comment.CoID}`).subscribe((res: Response) => {
			this.thisComment	= res.json();
			this.replies= this.thisComment.replies;
		});
	}

}
