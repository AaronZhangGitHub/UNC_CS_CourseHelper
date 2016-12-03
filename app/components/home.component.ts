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
        <a class="grey-text text-lighten-5" (click)="switchTab(forum)">Forum</a>
      </li>
    </ul>
  
    <div class="padded-container container">    
      <div #course_planner [hidden]="!isTab(course_planner)" class="col s12">
        <courseplanner></courseplanner>
      </div>
      <div #semester_planner [hidden]="!isTab(semester_planner)" class="col s12">
        <semesterplanner></semesterplanner>
      </div>
      <div #form [hidden]="!isTab(forum)" class="col s12">
        <forumc></forumc>
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
