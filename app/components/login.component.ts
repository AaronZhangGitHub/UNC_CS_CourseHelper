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

    <!-- Login Popup -->
    <div *ngIf="showPopup" class="modal open" style="z-index: 1003; display: block; opacity: 1; transform: scaleX(1); top: 10%;">
      <div class="modal-content">
        <p>Login Popup</p>
      </div>
      <div class="modal-footer">
        <a href="javascript:void(0)" (click)="hideDetails()" class="modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>
    <div *ngIf="showPopup" class="modal-overlay open" id="materialize-modal-overlay-1" style="z-index: 1002; display: block; opacity: 0.5;"></div>

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
  
  hideDetails() {
    this.showPopup = false;
  }
}
