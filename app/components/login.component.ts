import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';
@Component({
selector: 'login',
template: `
<topnotification text="Log In or Create a new Account"></topnotification>
<div class = "padded-container access-in-button-container" style = "text-align: center">
  <a href="javascript:void(0)" (click)="showDetailsLogin()" class="waves-effect waves-light btn-large">Log In</a>
  <a href="javascript:void(0)" (click)="showDetailsSignUp()"class="waves-effect waves-light btn-large">Sign Up</a>
</div>
<!-- Login Popup -->
<div *ngIf="showPopupLogin" class="modal open" style="z-index: 1003; display: block; opacity: 1; transform: scaleX(1); top: 10%;">
  <p style = "text-align: center">Please login with your UNC Email and Password</p>
  <div class="modal-content">
    <div class="row">
      <form class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">account_circle</i>
            <input id="email-login" type="email" class="validate">
            <label for="email-login">Email</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">vpn_key</i>
            <input id="password-login" type="password" class="validate">
            <label for="password-login">Password</label>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="modal-footer">
    <div class = "closeButton" style = "float: left;">
      <a href="javascript:void(0)" (click)="hideDetailsLogin()" class="modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
    <div class = "closeButton" style = "float: right;">
      <a href="javascript:void(0)" (click)="hideDetailsLogin()" class="modal-close waves-effect waves-green btn-flat"><i class="material-icons prefix">input</i></a>
    </div>
  </div>
</div>
<div *ngIf="showPopupLogin" class="modal-overlay open" id="materialize-modal-overlay-1" style="z-index: 1002; display: block; opacity: 0.5;"></div>
<!-- Sign Up Popup -->
<div *ngIf="showPopupSignUp" class="modal open" style="z-index: 1003; display: block; opacity: 1; transform: scaleX(1); top: 10%; max-height: 100%;">
  <p style = "text-align: center">Sign Up for your Account, please use your UNC Email for Username</p>
  <div class="modal-content">
    <div class="row">
      <form class="col s12">
        <div class="row">
          <div class="input-field col s6">
            <i class="material-icons prefix">account_circle</i>
            <input id="first-name-signup" type="text" class="validate">
            <label for="first-name-signup">First Name</label>
          </div>
          <div class="input-field col s6">
            <i class="material-icons prefix">account_circle</i>
            <input id="last-name-signup" type="text" class="validate">
            <label for="last-name-signup">Last Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">vpn_key</i>
            <input id="password-signup" type="password" class="validate">
            <label for="password-signup">Password</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">vpn_key</i>
            <input id="password-signup-repeat" type="password" class="validate">
            <label for="password-signup">Repeat Password</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">perm_identity</i>
            <input id="email-signup" type="email" class="validate">
            <label for="email-signup">Username</label>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="modal-footer">
    <div class = "closeButton" style = "float: left;">
      <a href="javascript:void(0)" (click)="hideDetailsSignUp()" class="modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
    <div class = "closeButton" style = "float: right;">
      <a href="javascript:void(0)" (click)="hideDetailsSignUp()" class="modal-close waves-effect waves-green btn-flat">Sign Up</a>
    </div>
  </div>
</div>
<div *ngIf="showPopupSignUp" class="modal-overlay open" id="materialize-modal-overlay-1" style="z-index: 1002; display: block; opacity: 0.5;"></div>
<!-- This is the correct way to do a link in angular -->
<a routerLink="/welcome" routerLinkActive="active" class="btn-floating btn-large">
  <i class="large material-icons">done</i>
</a>
`
})
export class LoginComponent {
@Output()
clicked = new EventEmitter();
showPopupLogin: boolean;
showPopupSignUp: boolean;
constructor() {
this.showPopupLogin = false;
this.showPopupSignUp = false;
}
showDetailsLogin() {
this.showPopupLogin = true;
}
hideDetailsLogin() {
this.showPopupLogin = false;
}
showDetailsSignUp(){
this.showPopupSignUp = true;
}
hideDetailsSignUp(){
this.showPopupSignUp = false;
}
}
