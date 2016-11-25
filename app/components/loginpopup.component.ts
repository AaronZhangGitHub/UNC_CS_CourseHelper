import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'loginpopup',
    template: `
  <div *ngIf="show" class="modal open" style="z-index: 1003; display: block; opacity: 1; transform: scaleX(1); top: 10%;">
    <div class="modal-content">
      <p>Login Popup</p>
    </div>
    <div class="modal-footer">
      <a href="javascript:void(0)" (click)="hide()" class="modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
  </div>

  <div *ngIf="show" class="modal-overlay open" id="materialize-modal-overlay-1" style="z-index: 1002; display: block; opacity: 0.5;"></div>
	`
})
export class LogInPopUpComponent {

  @Input()
  show: boolean;
  
  
  hide() {
    this.show = false;
  }
  
}
