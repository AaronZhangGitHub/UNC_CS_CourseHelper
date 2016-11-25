import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'coursepopup',
    template: `
  <div class="modal open">
    <div class="modal-content">
      <h4>Details on {{ course?.code }}</h4>
      <p>{{ course?.desc }}</p>
    </div>
    <div class="modal-footer">
      <a href="javascript:void(0)" (click)="onClickClose()" class="modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
  </div>

  <div class="modal-overlay open" id="materialize-modal-overlay-1" (click)="onClickClose()"></div>
	`,
  styleUrls: [ 'app/components/coursepopup.component.css' ]
})
export class CoursePopupComponent {

  @Output()
  close = new EventEmitter();
  
  @Input()
  course: CourseModel;
  
  onClickClose() {
    this.close.emit();
  }
  
}
