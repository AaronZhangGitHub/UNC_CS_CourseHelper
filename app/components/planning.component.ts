import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
  selector: 'welcome',
  template: `
    <topnotification text="Welcome, lets get started by selecting what classes you've already taken"></topnotification>
    
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
export class WelcomeComponent { }
