import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
  selector: 'welcome',
  template: `
    <topnotification text="Welcome, lets get started by selecting what classes you've already taken"></topnotification>
    
    <div class="padded-container container">
      <coursepopup></coursepopup>
    
      <coursescontainer></coursescontainer>
      <takencourses></takencourses>
    </div>
    
    <div class="fixed-action-btn">
      <a class="btn-floating btn-large" (click)="next()">
        <i class="large material-icons">done</i>
      </a>
    </div>
  `
})
export class WelcomeComponent {
  
  @Output()
  onNext = new EventEmitter();
  
  next() {
    this.onNext.emit();
  }
}
