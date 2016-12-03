import { Component, Input, Output, EventEmitter, OnInit, OnDestroy  } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { CoursesService } from '../services/courses.service';
import { DragulaService } from '../../node_modules/ng2-dragula/ng2-dragula.js';
import { Subscription } from 'rxjs/Subscription';

// Drag and drop courses between semesters
@Component({
  selector: 'semestercategorizer',
  template: `    
    <table id="semester-wrapper" [style.height.px]="cardHeight * 2">
      <tbody>
        <tr id="semester-row">
          <td class="semester" *ngFor="let courses of semesters; let i = index;" [style.height.px]="cardHeight">
            <div class="card">
              <div class="card-content">
                <span class="card-title">Semester {{ i+1 }}</span>
                <div class="semester-div" [dragula]="'semester'" [dragulaModel]="courses">
                  <course-chip [course]="c" [closeable]="false" *ngFor="let c of courses"></course-chip>
                </div>
              </div>
              <div class="card-action" *ngIf="semesters.length > 1">
                <a href="javascript:void(0)" (click)="removeSemester(i)">Remove</a>
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
  semesters: CourseModel[][];
  cardHeight: number;
  
  private dragulaSubscription: Subscription;
  private semestersSubscription: Subscription;
  
  constructor(private dragulaService: DragulaService, private courseService: CoursesService) { 
    this.cardHeight = 0;
    this.semesters = [];
  }
  
  ngOnInit() {
    this.dragulaSubscription = this.dragulaService.drop.subscribe((value: any) => {
      this.courseService.forceCourseSemesters(this.semesters);
    });

    // Inital setup
    this.semestersSubscription = this.courseService.getCourseSemestersAsObservable()
      .subscribe((semesters: CourseModel[][]) => {
        this.semesters = semesters;
        this.onCourseOrderChanged();
      });
  }
  
  private addSemester() {
    this.courseService.addSemester();
  }
  
  private removeSemester(id: number) {
    this.courseService.removeSemester(id);
  }
  
  // Recalculate height
  private onCourseOrderChanged() {  
    var max_cnt = this.courseService.getMaxCoursesInSemester();    
    this.cardHeight = (max_cnt+1)*37 + 150;
  }
  
  ngOnDestroy() {
    if (this.dragulaSubscription) this.dragulaSubscription.unsubscribe();
    if (this.semestersSubscription) this.semestersSubscription.unsubscribe();
  }
}
