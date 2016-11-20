import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'welcome',
    template: `
  <div class="row top-row blue lighten-4 z-depth-1" [class.minimized]="done">
    <div class="center-align">
      <div class="col text-col s12">
        <h5 class="flow-text">Welcome, lets get started selecting what classes you've already taken</h5>
        
        <a class="waves-effect waves-light btn-large" (click)="clickOK()">OK</a>
      </div>
    </div>
  </div>
  
  <div class="container">
    <coursescontainer></coursescontainer>
    <takencourses></takencourses>
  </div>
	`,
  styles: [`
    .container {
      padding-bottom: 55px;
    }
  `]
})
export class WelcomeComponent {
	done: boolean;
  
  constructor() {
    this.done = false;
  }
	
	private clickOK() {		
		this.done = true;
	}
}
