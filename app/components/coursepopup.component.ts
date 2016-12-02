import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserService } from '../services/user.service';
import { CoursesService } from '../services/courses.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'coursepopup',
    template: `
  <div class="modal bottom-sheet" [class.open]="open">
    <div class="modal-content">
      <a *ngIf="!coursesService.hasTaken(course)" (click)="setTaken()" class="btn pull-right">
        Set as taken
      </a>
    
      <h4>Details on {{ course?.code }}</h4>
      
      <div class="row">
        <div class="col m1 s12">
          <b>Prereqs</b>
        </div>
        <div class="col m10 s12">
          <div *ngFor="let group of prereqs | async">
            <i *ngIf="group.length > 1">One of &nbsp;</i>
            <div class="chip" *ngFor="let course of group">
              {{ course.code }}
            </div>
          </div>
        </div>
      </div>
      
      <p>{{ course?.long_desc }}</p>
    </div>
    <div class="modal-footer">
      <a href="javascript:void(0)" (click)="onClickClose()" class="modal-action modal-close btn-flat">
        Close
      </a>
    </div>
  </div>

  <div class="modal-overlay" [class.open]="open" (click)="onClickClose()"></div>
	`,
  styleUrls: [ 'app/components/coursepopup.component.css' ]
})
export class CoursePopupComponent implements OnInit {

  private open = false;
  private course: CourseModel = null;
  private prereqs: Observable<CourseModel[][]>;
  
  close = new EventEmitter();
  
  constructor(private coursesService: CoursesService) { }
  
  ngOnInit() {
    setTimeout(() => { this.open = true }, 50);
  }
  
  public setCourse(c: CourseModel) {
    this.course = c;
    this.prereqs = this.coursesService.getPrereqs(this.course);
  }
  
  setTaken() {
    this.coursesService.setAsTaken(this.course);
  }
  
  onClickClose() {
    this.open = false;
    setTimeout(() => { this.close.emit() }, 500);
  }
  
}
