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
  	<div id="createPostModal" class="modal bottom-sheet">
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
	get cid() {
		return this._cid;
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

	postPost(pt: string, te: string){
		if(pt==="" || te ===""){
			//do nothing
		}else{
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
