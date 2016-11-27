import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserService } from '../services/user.service';

@Component({
    selector: 'coursepopup',
    template: `
  <div class="modal bottom-sheet" [class.open]="open">
    <div class="modal-content">
      <a *ngIf="!course?.hasTaken(userService)" (click)="setTaken()" class="btn pull-right">
        Mark as taken
      </a>
    
      <h4>Details on {{ course?.code }}</h4>
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
  close = new EventEmitter();
  
  @Input()
  course: CourseModel;
  
  constructor(private userService: UserService) { }
  
  ngOnInit() {
    setTimeout(() => { this.open = true }, 50);
  }
  
  setTaken() {
    this.userService.setTaken(this.course);
  }
  
  onClickClose() {
    this.open = false;
    setTimeout(() => { this.close.emit() }, 500);
  }
  
}
