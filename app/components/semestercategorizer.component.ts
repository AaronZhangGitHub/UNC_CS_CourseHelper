import { Component, Input, Output, EventEmitter, OnInit, OnDestroy  } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { SemesterModel } from '../models/semester.model';
import { UserService } from '../services/user.service';
import { DragulaService } from '../../node_modules/ng2-dragula/ng2-dragula.js';
import { Subscription } from 'rxjs/Subscription';

// Drag and drop courses between semesters
@Component({
  selector: 'semestercategorizer',
  template: `    
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
  `,
  styleUrls: [ "app/components/semestercategorizer.component.css" ]
})
export class SemesterCategorizerComponent implements OnInit, OnDestroy {
  
  // Default to only one semester
  semesters: SemesterModel[];
  cardHeight: number;
  
  private dragulaSubscription: Subscription;
  private prereqsSubscription: Subscription;
  
  constructor(private dragulaService: DragulaService, private userService: UserService) { 
    this.cardHeight = 0;
  }
  
  ngOnInit() {
    this.dragulaSubscription = this.dragulaService.drop.subscribe((value: any) => {
      // At this point object has been moved in arrays, save changes    
      this.onCourseOrderChanged();
    });

    // Load semesters
    this.semesters = this.userService.getCourseSemesters();
    
    // Setup view and save
    this.onCourseOrderChanged();
  }
  
  private addSemester() {
    this.semesters.push(new SemesterModel("Semester " + (this.semesters.length+1)));
  }
  
  private removeSemester(sm: any) {
    let idx = this.semesters.indexOf(sm);
    if (idx >= 0 && this.semesters.length > 1) {
      this.semesters.splice(idx, 1);
      
      // Move courses
      let nextSm: SemesterModel = this.semesters[ Math.min(idx, this.semesters.length-1) ];
      for (let c of sm.courses) nextSm.addCourse(c);
      
      // Rename semesters
      this.semesters.forEach((sm, idx) => { sm.name = "Semester " + (idx+1) });
      
      this.onCourseOrderChanged();
    }
  }
  
  private onCourseOrderChanged() {  
    var max_cnt = 0;
    for (let i = 0, ii = this.semesters.length; i < ii; i++) {
      let sm: SemesterModel = this.semesters[i];    
      if (sm.courses.length > max_cnt) max_cnt = sm.courses.length;
    }
    
    this.userService.postCourseSemesters(this.semesters);    
    this.cardHeight = (max_cnt+1)*37 + 150;
  }
  
  ngOnDestroy() {
    if (this.dragulaSubscription) this.dragulaSubscription.unsubscribe();
    if (this.prereqsSubscription) this.prereqsSubscription.unsubscribe();
  }
}
