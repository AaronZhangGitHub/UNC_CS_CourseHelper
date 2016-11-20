import { Component } from '@angular/core';
import { CourseModel } from './models/course.model';
import { CoursesService } from './services/courses.service';
import { UserService } from './services/user.service';

@Component({
    selector: 'my-app',
    template: `
    <welcome></welcome>
    
    <div class="fixed-action-btn">
      <a class="btn-floating btn-large">
        <i class="large material-icons">done</i>
      </a>
    </div>
	`
})
export class AppComponent { }
