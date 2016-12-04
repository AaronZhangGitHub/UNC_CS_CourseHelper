import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { Http, Response } from '@angular/http';
import { UserService } from '../services/user.service';

@Component({
	selector:'post',
	template: `
		<div class="{{ color }}">
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
	`})

export class PostComponent implements OnInit {

	@Input()
	post: any;

	@Input()
	color: string;

	constructor(private http: Http) { }

	ngOnInit() {
		// http get

	}

}
