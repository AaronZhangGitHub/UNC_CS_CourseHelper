import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
  selector: 'welcome',
  template: `
    <topnotification text="Welcome, let's get started by selecting what classes you've already taken"></topnotification>
    
    <div class="padded-container container">
      <coursepopup></coursepopup>
    
      <coursescontainer></coursescontainer>
      <takencourses></takencourses>
    </div>
    
    <div class="fixed-action-btn">
      <a routerLink="/semester" routerLinkActive="active" class="btn-floating btn-large">
        <i class="large material-icons">done</i>
      </a>
    </div>
  `
})
export class WelcomeComponent {
  
  @Output()
  onNext = new EventEmitter();
}
