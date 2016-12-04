import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

// After user has created an account and selected their taken courses this is the default page
@Component({
  selector: 'home',
  template: `
    <ul class="tabs tabs-transparent blue">
      <li class="tab" [class.active]="isTab(course_planner)">
        <a class="grey-text text-lighten-5" (click)="switchTab(course_planner)">Course Planner</a>
      </li>
      <li class="tab" [class.active]="isTab(semester_planner)">
        <a class="grey-text text-lighten-5" (click)="switchTab(semester_planner)">Semester Planner</a>
      </li>
      <li class="tab" [class.active]="isTab(forum)">
        <a class="grey-text text-lighten-5" (click)="switchTab(forum)">Course Page</a>
      </li>
    </ul>
  
    <!-- SVG wrap entire width -->
    <div #course_planner [hidden]="!isTab(course_planner)" class="col s12">
      <div id="lines-wrapper" style="padding-left: 5px; height: 800px; overflow-x: scroll; overflow-y: hidden;">
        <innersvg></innersvg>
      </div>
    </div>
    <div #form [hidden]="!isTab(forum)" class="col s12">
      <div class = "row">
        <coursePage></coursePage>
      </div>
    </div>
  
    <div class="padded-container container" [hidden]="!isTab(semester_planner)">    
      <div #semester_planner class="col s12">
        <semesterplanner></semesterplanner>
      </div>
    </div>
    
    <div class="fixed-action-btn">
      <a class="btn-floating btn-large">
        <i class="large material-icons">menu</i>
      </a>
    </div>
  `,
  styleUrls: [ 'app/components/home.component.css' ]
})
export class HomeComponent {
  
  private tab: any;
  
  private switchTab(t: any) {
    this.tab = t;
  }
  
  private isTab(t: any) {
    return this.tab === t;
  }
  
}
