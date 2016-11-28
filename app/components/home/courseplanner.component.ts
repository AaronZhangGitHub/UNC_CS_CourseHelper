import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../../models/course.model';

// Select courses (need ability to mark as taken or planned)
@Component({
  selector: 'courseplanner',
  template: `
    <p>Here you can look for classes you might like to take</p>
  `
})
export class CoursePlannerComponent {
  
}
