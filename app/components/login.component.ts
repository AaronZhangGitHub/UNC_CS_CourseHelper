import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
  selector: 'login',
  template: `    
    <topnotification text="Log In or Create a new Account"></topnotification>
    <div class = "padded-container access-in-button-container" style = "text-align: center">
      <a href="javascript:void(0)" (click)="showDetails()" class="waves-effect waves-light btn-large">Log In</a>
      <a class="waves-effect waves-light btn-large">Sign Up</a>
    </div>

    <loginpopup ="model" [show]="showPopup"></loginpopup>

    <!-- This is the correct way to do a link in angular -->
    <a routerLink="/welcome" routerLinkActive="active" class="btn-floating btn-large">
      <i class="large material-icons">done</i>
    </a>
  `
})
export class LoginComponent {
	
	@Output()
	clicked = new EventEmitter();
  
  showPopup: boolean;
  
  constructor() {
    this.showPopup = false;
  }
  
  showDetails() {
    this.showPopup = true;
  }
}
