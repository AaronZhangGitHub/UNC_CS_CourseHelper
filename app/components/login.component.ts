import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
  selector: 'login',
  template: `    
    <div>Login controls</div>
    
    <!-- This is the correct way to do a link in angular -->
    <a routerLink="/welcome" routerLinkActive="active" class="btn-floating btn-large">
      <i class="large material-icons">done</i>
    </a>
  `
})
export class LoginComponent {
  
}
