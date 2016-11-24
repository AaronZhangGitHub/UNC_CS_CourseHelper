import { Component } from '@angular/core';
import { CourseModel } from './models/course.model';
import { CoursesService } from './services/courses.service';
import { UserService } from './services/user.service';

enum Page { WELCOME = 1, SEMESTER = 2, PLANNING = 3 }

@Component({
  selector: 'my-app',
  template: `
  <nav class="blue lighten-1">
    <div class="nav-wrapper">
        <div class="input-field">
          <input id="search" type="search" required>
          <label for="search"><i class="material-icons">search</i></label>
          <i class="material-icons">close</i>
        </div>
    </div>
  </nav>
  
  <welcome *ngIf="page == 1" (onNext)="finishWelcome()"></welcome>
  <semester *ngIf="page == 2"></semester>
	`
})
export class AppComponent {   
  page: Page;
  
  constructor(private userService: UserService) {
    this.page = Page.WELCOME;
  }
  
  finishWelcome() {
    if (this.userService.getTakenCourses().length > 0) {
      this.page = Page.SEMESTER;
    } else {
      this.page = Page.PLANNING;
    }
  }
  
}
