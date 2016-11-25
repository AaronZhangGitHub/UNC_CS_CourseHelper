import { Component } from '@angular/core';
import { CourseModel } from './models/course.model';
import { CoursesService } from './services/courses.service';
import { UserService } from './services/user.service';

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
  
  <router-outlet (activate)="onActivate($event, outlet)" #outlet></router-outlet>`
})
export class AppComponent {
  onActivate(e: any, outlet: any) {
    outlet.scrollTop = 0;
  }
}