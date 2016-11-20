import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
  selector: 'topnotification',
  template: `
    <div class="row top-row blue lighten-4 z-depth-1" [class.minimized]="done">
      <div class="center-align">
        <div class="col text-col s12">
          <h5 class="flow-text">{{ text }}</h5>
          
          <a *ngIf="!done" class="waves-effect waves-light btn-large" (click)="clickOK()">OK</a>
        </div>
      </div>
    </div>`
})
export class TopNotificationComponent {
	done: boolean;
  
  @Input()
  text: string;
  
  constructor() {
    this.done = false;
  }
	
	private clickOK() {		
		this.done = true;
	}
}
