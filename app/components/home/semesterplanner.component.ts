import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../../models/course.model';

// Categorize classes (taken and planned) by semester
@Component({
  selector: 'semesterplanner',
  template: `
    <p>Here you can categorize organize your courses by semester</p>
    
    <semestercategorizer></semestercategorizer>
  `
})
export class SemesterPlannerComponent {
  
}
