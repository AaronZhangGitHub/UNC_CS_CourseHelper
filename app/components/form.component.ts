import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { Http, Response } from '@angular/http';
import { UserService } from '../services/user.service';

@Component({
	selector:'formPage',
	template: `
		<div *ngIf = "posts.size!==0" stlye = "width: 100%" >
			<div *ngFor="let post of posts" class = "post-container blue lighten-3" style = "width: 100%; border-style: groove;" >
					<div class = "post-Info" style = "font-size: 8pt">
						<div class = "post-title" style = "float: left">&nbsp;{{post.title}}</div>
						<div class = "post-date" style = "float: left">&nbsp;Date-Posted: {{post.datetime}}</div>
						<div class = "post-pid" style = "float: left">&nbsp;PID: {{post.pid}}</div>
						<div class = "post-cid" style = "float: left">&nbsp;CID: {{post.cid}}</div>
						<div class = "post-uid" style = "float: left">&nbsp;UID: {{post.uid}}</div>
					</div>
          <div class = "post-Body" style = "font-size: 12pt">
          	<br>&nbsp;{{post.text}}
          </div>  
          <div class = "" style = "width: 100%;">
          	<span style = "width: 33%;"><i class="fa fa-arrow-up" aria-hidden="true"></i></span>
          	<span style = "width: 33%;">&nbsp; Score: {{post.weight}} &nbsp;</span>
          	<span style = "width: 33%;"><i class="fa fa-arrow-down" aria-hidden="true"></i></span>
          	<a href = "">&nbsp;Add Comment</a>
          </div>
			</div>
		</div>

		<div *ngIf = "posts.length==0">
			<p>No Posts to Show</p>
		</div>

		<textarea rows="4" cols="50">Enter your text here
		</textarea>

		<p>{{posts | json}}</p>
	`,
  styles:[]
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
}
