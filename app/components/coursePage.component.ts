import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { CoursesService } from '../services/courses.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/Observable';
import { UserModel } from '../models/user.model';

var $ = (window as any).$ || {};
var Materialize = (window as any).Materialize || {};

//loads the posts and comments from a particular course
@Component({
selector: 'coursePage',
template: `
<div class="row">
    <div class="col s3">
        <ul id="slide-out" style="position:absolute; z-index: 10;" class="side-nav">
            <li>
                <div class="userView" style="width: 300px; height: 175px;">
                    <div class="background">
                        <img src="images/chapelhill-grad.png">
                    </div>
                    <a href="#!name"><span class="white-text name" style = "text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">{{ (user | async)?.Name }}</span></a>
                    <a href="#!email"><span class="white-text email" style = "text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">{{(user | async)?.Username}}</span></a>
                    <a href="#!class"><span class="white-text email" style = "text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">Selected Course: {{ course }}</span></a>
                </div>
            </li>
            <ul class="collapsible collapsible-accordion" data-collapsible="accordion">
                <li [class.active]="open">
                    <div class="collapsible-header" (click)="open = !open" [class.active]="open"><i class="fa fa-book" aria-hidden="true"></i>Class</div>
                    <div class="collapsible-body">
                        <ul>
                            <div>
                                <li style="cursor: pointer" class="collection-item" *ngFor="let course of courseService.getTakenCourses() | async" ng-class="{course.code: true}" href="javascript:void(0)" (click)="setCurrentUserClass(course.CID, course.code)">
                                    <a>
                						{{ course.code }}
              						</a>
                                </li>
                            </div>
                        </ul>
                    </div>
                </li>
            </ul>
        </ul>
    </div>
    <div class="col s9">
    	<div *ngIf="course !== 'Not Entered'" class="row" >
		    <div class="col s12">
		        <ul class="tabs">
		            <li class="tab col s12" id="forumTab"><a (click)="showForum()" class="active">Forum</a></li>
		        </ul>
		    </div>
		</div>

		<div class="form-wrapper">
        <div *ngIf="!forumB && !recourcesB">
            <p>Select a course to access its Forum.</p>
        </div>
        <div *ngIf="forumB && !recourcesB">
            <formPage [cid]="cid" [course]="course"></formPage>
        </div>
    </div>
    </div>
    
</div>


`,
styles: [
`
.side-nav {
transform: translateX(0px);
margin-top: 112px;
}
.collapsible li.active .collapsible-body {
display: block !important;
}

.tab > a.active {
	border-bottom: 2px solid #ee6e73;
}
`
]
})
export class CoursePageComponent implements AfterViewInit {
  open: boolean;
  user: Observable<UserModel>;
  cid: number;
  course: String;
  forumB: boolean;
  recourcesB: boolean;
  constructor(public courseService: CoursesService, public userService: UserService) {
    this.user = userService.getUser();
    this.open = true;
    this.cid = null;
    this.course = "Not Entered";
    this.forumB = false;
    this.recourcesB = false;
}
  setCurrentUserClass(cidI: number, courseI: string){
    this.cid = cidI;
    this.course = courseI;
    this.showForum();
    $('ul.tabs').tabs();

  }
  showForum(){
  	$("#forumTab > a").addClass("active");
  	$("#resourcesTab > a").removeClass("active");
    if(this.course ==="Not Entered"){
      // alert("Please select a course first");
      Materialize.toast('<span class="red-text">Please select a course first</span>', 5000);

    }else{
    this.forumB = true;
    this.recourcesB = false;
    }
  }
  showResources(){
  	$("#forumTab > a").removeClass("active");
  	$("#resourcesTab > a").addClass("active");
    if(this.course ==="Not Entered"){
      // alert("Please select a course first");
       Materialize.toast('<span class="red-text">Please select a course first</span>', 5000);
    }else{
    this.forumB = false;
    this.recourcesB = true;
  }
  }
  
  ngAfterViewInit() {
    // document ready
    $(".collapsible").collapsible();
    $('ul.tabs').tabs();

  }
}
