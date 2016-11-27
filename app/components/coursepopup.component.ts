import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'coursepopup',
    template: `
  <div class="modal bottom-sheet" [class.open]="open">
    <div class="modal-content">
      <h4>Details on {{ course?.code }}</h4>
      <p>{{ course?.desc }}</p>
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
  
  ngOnInit() {
    setTimeout(() => { this.open = true }, 50);
  }
  
  onClickClose() {
    this.open = false;
    setTimeout(() => { this.close.emit() }, 500);
  }
  
}
