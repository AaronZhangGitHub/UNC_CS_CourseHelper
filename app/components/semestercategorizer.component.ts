import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserService } from '../services/user.service';
import { DragulaService } from '../../node_modules/ng2-dragula/ng2-dragula.js';

// Drag and drop courses between semesters
@Component({
  selector: 'semestercategorizer',
  template: `    
    <div class="padded-container container">
      <table id="semester-wrapper" [style.height.px]="cardHeight * 2">
        <tbody>
          <tr id="semester-row">
            <td class="semester" *ngFor="let sm of semesters" [style.height.px]="cardHeight">
              <div class="card">
                <div class="card-content">
                  <span class="card-title">{{ sm.name }}</span>
                  <div class="semester-div" [dragula]="'semester'" [dragulaModel]="sm.courses">
                    <course-chip [course]="c" [closeable]="false" *ngFor="let c of sm.courses"></course-chip>
                  </div>
                </div>
                <div class="card-action" *ngIf="semesters.length > 1">
                  <a href="javascript:void(0)" (click)="removeSemester(sm)">Remove</a>
                </div>
              </div>
            </td>
            <td *ngIf="semesters.length < 8" id="add-semester" class="col l3 m4 s6 z-depth-1" (click)="addSemester()" [style.height]="cardHeight + 'px'">
              <h4>+</h4>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: [ "app/components/semestercategorizer.component.css" ]
})
export class SemesterCategorizerComponent implements OnInit {
  
  // Default to only one semester
  semesters: Array<any> = [ { name: "Semester 1", courses: [] } ];
  cardHeight: number;
  
  constructor(private dragulaService: DragulaService, private userService: UserService) { 
    this.cardHeight = 0;
    
    dragulaService.drop.subscribe((value: any) => {      
      this.recalculateHeight();
    });
  }
  
  ngOnInit() {
    for (let c of this.userService.getTakenCourses()) {
      this.semesters[0].courses.push(c);
    }
    this.recalculateHeight();
  }
  
  recalculateHeight() {
    var cnt = 0;
    for (let sm of this.semesters) {
      if (sm.courses.length > cnt) cnt = sm.courses.length;
    }
    
    this.cardHeight = (cnt+1)*37 + 150;
  }
  
  addSemester() {
    this.semesters.push({ name: "Semester " + (this.semesters.length+1), courses: [] });
  }
  
  removeSemester(sm: any) {
    let idx = this.semesters.indexOf(sm);
    if (idx >= 0 && this.semesters.length > 1) {
      this.semesters.splice(idx, 1);
      
      // Move courses
      let nextSm = this.semesters[ Math.min(idx, this.semesters.length-1) ];
      for (let c of sm.courses) nextSm.courses.push(c);
      
      // Rename semesters
      this.semesters.forEach((sm, idx) => { sm.name = "Semester " + (idx+1) });
      
      this.recalculateHeight();
    }
  }
}
