import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { Http, Response } from '@angular/http';
import { UserService } from '../services/user.service';

@Component({
	selector:'formPage',
	template: `
		<div *ngIf = "posts.size!==0" >
			<div *ngFor="let post of posts" class = "post-container" style = "width: 100%; border-style: groove;" >
					<post [post]="post" [color]="'blue lighten-3'"></post>
			</div>
		</div>
		<div *ngIf = "posts.length==0">
			<p>No Posts to Show</p>
		</div>
		<br>
		<div class="row">
    <form class="col s12">
      <div class="row">
        <div class="input-field col s16">
          <input #postTitle id="post_title" type="text" class="validate">
          <label for="post_title">Post Title</label>
        </div>
      </div>
    </form>
  </div>
	<textarea #textEntry rows="4" cols="50">Enter your text here</textarea>
		<button ref="javascript:void(0)" (click)="signUpUser(postTitle.value, textEntry.value)" class="btn waves-effect waves-light" type="submit" name="action">Enter
    <i class="material-icons right">send</i></button>

		<p>{{posts | json}}</p>
	`
})
export class FormComponent{
	commentURL: string;
	posts: any;
	private _cid: number;

	@Input()
	set cid(cid: number) {
		this._cid = cid;
		if (cid !== null) {
			this.http.get(`${this.commentURL}/${this.cid}`).subscribe((res: Response) => {
					this.posts	= res.json();
				});
		}
	}
	get cid() {
		return this._cid;
	}

	constructor(public http: Http, public userservice: UserService){
		this.commentURL = 'http://localhost/final/Database/forum.php';
		this.posts = [];
	}
	signUpUser(pt: String, te: String){
		console.log(pt);
		console.log(te);
	}
}
