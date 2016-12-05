import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserModel } from '../models/user.model';
import { Http, Response } from '@angular/http';
import { UserService } from '../services/user.service';

@Component({
	selector:'formPage',
	template: `
		<div *ngIf = "posts.size!==0" >
			<div *ngFor="let post of posts" class = "post-container" style = "width: 100%; border-style: groove;" >
					<post [post]="post" [color]="'blue lighten-0'"></post>
			</div>
		</div>
		<div *ngIf = "posts.length==0">
			<p>No Posts to Show</p>
		</div>
		<br>
	<div class="row">
		<button ref="javascript:void(0)" (click)="showPostPostModal()" class="btn waves-effect waves-light" type="submit" name="action">Create Post
    <i class="material-icons right">send</i></button>
  </div>

  <div *ngIf="showPopUpModal" class="modal open" style="z-index: 1003; display: block; opacity: 1; transform: scaleX(1); top: 10%;">
  	<div class="modal-content">
     	 <form class="col s12">
      	  <div class="row">
        	  <div class="input-field col s6">
          		<input #postTitle id="post_title" type="text" class="validate">
          		<label for="post_title">Post Title</label>
        		</div>
        			<textarea #textEntry rows="4" cols="50">Post body goes here. </textarea>
        	</div>
      	</form>
  	</div>
  	<div class="modal-footer">
    	<div class = "closeButton" style = "float: left;">
      	<a href="javascript:void(0)" (click)="hidePostPostModal()" class="modal-close waves-effect waves-green btn-flat">Close</a>
    	</div>
    	<div class = "closeButton" style = "float: right;">
      	<a href="javascript:void(0)" (click)="postPost(postTitle.value, textEntry.value)" class="modal-close waves-effect waves-green btn-flat"><i class="material-icons prefix">input</i></a>
    	</div>
  	</div>
	</div>
		<p>{{posts | json}}</p>
	`
})
export class FormComponent{
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

	showPostPostModal(){
		this.showPopUpModal = true;
	}
	hidePostPostModal(){
		this.showPopUpModal = false;
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
				this.hidePostPostModal();
				this.loadPosts();
			}, (err) => console.log(err));
		});
	}
}
}
