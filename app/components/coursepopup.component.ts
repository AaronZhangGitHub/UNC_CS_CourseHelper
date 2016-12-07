import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserService } from '../services/user.service';
import { CoursesService } from '../services/courses.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'coursepopup',
    template: `
  <div class="modal bottom-sheet" [class.open]="open">
    <div class="modal-content">
      <a *ngIf="!coursesService.hasTaken(course)" (click)="setTaken()" class="btn pull-right">
        Set as taken
      </a>
    
      <h4>Details on {{ course?.code }}</h4>
      
      <h6>Category: {{ course?.category }} <small>{{ course?.alt_cat }}</small></h6>
      
      <p>{{ course?.long_desc }}</p>
      
      <div class="row" *ngIf="prereqs.length > 0 && prereqs[0].length > 0">
        <div class="col m1 s12">
          <b>Prereqs</b>
        </div>
        <div class="col m10 s12">
          <div *ngFor="let group of prereqs">
            <i *ngIf="group.length > 1">One of &nbsp;</i>
            <course-chip [crossout]="coursesService.hasTaken(course)" *ngFor="let course of group" 
                [closeable]="false" [course]="course"></course-chip>
          </div>
        </div>
      </div>
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
export class CoursePopupComponent implements OnInit, OnDestroy {

  private open = false;
  private course: CourseModel = null;
  private prereqs: CourseModel[][];
  private prereqsSub: Subscription;
  
  close = new EventEmitter();
  
  constructor(private coursesService: CoursesService) {
    this.prereqs = [];
  }
  
  ngOnInit() {
    setTimeout(() => { this.open = true }, 50);
  }
  
  public setCourse(c: CourseModel) {
    this.course = c;
    this.prereqsSub = this.coursesService.getPrereqs(this.course).subscribe((prereqs: CourseModel[][]) => {
      this.prereqs = prereqs;
    });
  }
  
  setTaken() {
    this.coursesService.setAsTaken(this.course);
  }
  
  onClickClose() {
    this.open = false;
    setTimeout(() => { this.close.emit() }, 500);
  }
  
  ngOnDestroy() {
    if (this.prereqsSub) this.prereqsSub.unsubscribe();
  }

}
