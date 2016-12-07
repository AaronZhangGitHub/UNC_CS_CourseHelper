import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { Http, Response } from '@angular/http';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';

var $ = (window as any).$ || {};
var Materialize = (window as any).Materialize || {};

@Component({
	selector:'comment',
	template: `
		<div class="container" [style.padding-left.px]="depth*50">
	        <div class="card teal darken-2 white-text">
	            <div class="card-content">
	                <div class="row">
	                    <div class="col s1">
	                        <a (click)="upvote()" class="white-text upvote"><i class="material-icons">keyboard_arrow_up</i></a>
	                        <div class="comment-score">{{comment.weight}}</div>
	                        <a (click)="downvote()" class="white-text downvote"><i class="material-icons">keyboard_arrow_down</i></a>
	                    </div>
	                    <div class="col s11 ">
	                        <div class="comment-body grey-text text-lighten-2">
	                            {{comment.text}}
	                        </div>
	                        <div class="comment-date right">{{comment.datetime}}</div>
	                    </div>
	                </div>
	            </div>
	            <div class="card-action">
					<a (click)="showCreateCommentModal(comment.coid)" class="blue-text text-lighten-5">Reply</a>
				</div>
	        </div>

	        <div id="createCommentModal-{{ comment.coid }}" style="position: absolute; z-index: 100" class="modal bottom-sheet">
		  	<div class="modal-content">
		 	 	<form class="col s12">
		      	  	<div class="row">
		        	  	<div class="input-field col s6">
				          <textarea #textEntry id="createCommentBody" class="materialize-textarea"></textarea>
				          <label for="createCommentBody">Comment body</label>
			        	</div>
			        </div>
		      	</form>
		  	</div>
		  	<div class="modal-footer">
		      	<a (click)="hideCreateCommentModal(comment.coid)" class="left modal-close waves-effect waves-green btn-flat">Close</a>
		      	<a (click)="addComment(textEntry.value)" class="left modal-close waves-effect waves-green btn-flat">Submit</a>
		  	</div>
		</div>
	    </div>

	    <div *ngIf="replies.length>0"  class="postComment">
		    <div *ngFor="let rep of replies">
				<comment [comment]="rep" [post]="post" [depth]="depth+1"></comment>
			</div>
		</div>
	    
		
	`
	,
	styles:[
	`
	.comment-date {
		font-size: .8em;
		text-align: right;
	}

	.comment-score {
		text-align: center;
		padding-right: .7em;
	}

	.card-action a {
		cursor: pointer;
	}

	.upvote, .downvote {
		cursor: pointer;
	}
	`]
})

export class CommentComponent implements AfterViewInit {
	URL: string;
	thisComment: any;
	replies: any;
	showPopUpModal: boolean;

	@Input()
	depth: number;

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
	showCreateCommentModal(id: number){
		$("#createCommentModal-" + id).modal('open');
		$("#createCommentBody").val("");
	}
	hideCreateCommentModal(id: number){
		$("#createCommentModal-" + id).modal('close');

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
		console.log(this.post.cid);
		console.log(this.post.pid);
		console.log(this.comment.coid);
		console.log(`${this.URL}/${this.post.cid}/${this.post.pid}`);
		this.userservice.getUser().subscribe((user: UserModel) => {
			this.http.post(`${this.URL}/${this.post.cid}/${this.post.pid}/`,{
				text:textEntryVal,
				uid: user.UID,
				parentID: this.comment.coid
			}).subscribe((res: Response)=>{
				console.log(res);
				console.log(this.comment.replies);
				//this.comment.replies.push(res.json());
				console.log(this.comment.replies);
				this.hideCreateCommentModal(this.comment.coid);
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
  
  ngAfterViewInit() {
    // document ready
    	$(".modal").modal();
  }
}
