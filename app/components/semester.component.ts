import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'semester',
  template: `
    <topnotification text="Optionally categorize the courses you've taken by semester"></topnotification>
    
    <div class="padded-container container">
      <div id="semester-wrapper">
        <div id="semester-row" class="row">
          <div class="semester col l3 m4 s6" *ngFor="let sm of semesters" [dragula]="'semester'">
            <h4>{{ sm.name }}</h4>
            <div class="chip" *ngFor="let course of sm.courses" [innerHtml]="course"></div>
            <button type="button"></button>
          </div>
          <div *ngIf="semesters.length < 8" id="add-semester" class="col l3 m4 s6 z-depth-1" (click)="addSemester()">
            <h4>+</h4>
          </div>
        </div>
      </div>
    </div>
    
    <div class="fixed-action-btn">
      <a class="btn-floating btn-large">
        <i class="large material-icons">menu</i>
      </a>
      <ul>
        <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
        <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
        <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
      </ul>
    </div>
  `,
  styles: [`
    .gu-mirror {
      position: fixed !important;
      margin: 0 !important;
      z-index: 9999 !important;
      opacity: 0.8;
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
      filter: alpha(opacity=80);
    }
    .gu-hide {
      display: none !important;
    }
    .gu-unselectable {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    .gu-transit {
      opacity: 0.2;
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
      filter: alpha(opacity=20);
    }
    /* dragula-specific example page styles */
    .dragula-container {
      display: table-cell;
      margin: 2px;
    }
    .chip {
      display: block;
      width: 120px;
      text-align: center;
      cursor: move;
    }
    #semester-wrapper {
      display: table;
      width: 100%;
      height: 100%;
    }
    #semester-row {
      display: table-row;
    }
    #add-semester, 
    .semester {
      height: 100%;
      margin-bottom: 15px;
      display: inline-block;
    }
    #add-semester {
      text-align: center;
      width: 150px;
      background-color: rgba(225, 245, 254, 0.5);
      cursor: pointer;
    }
    #add-semester h4 {
      margin-top: 50%;
    }
    `
  ]
})
export class SemesterComponent implements OnInit {
  
  @Output()
  onNext = new EventEmitter();
  
  semesters: Array<any> = [ { name: "Semester 1", courses: [] } ];
  
  constructor(private userService: UserService) { }
  
  next() {
    this.onNext.emit();
  }
  
  ngOnInit() {
    for (let c of this.userService.getTakenCourseCodes()) {
      this.semesters[0].courses.push(c);
    }
  }
  
  addSemester() {
    this.semesters.push({ name: "Semester " + (this.semesters.length+1), courses: [] });
  }
}
