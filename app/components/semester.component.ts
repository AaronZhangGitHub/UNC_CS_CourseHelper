import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserService } from '../services/user.service';
import { DragulaService } from '../../node_modules/ng2-dragula/ng2-dragula.js';

@Component({
  selector: 'semester',
  template: `
    <topnotification text="Optionally categorize the courses you've taken by semester"></topnotification>
    
    <div class="padded-container container">
      <table id="semester-wrapper" [style.height.px]="cardHeight * 2">
        <tbody>
          <tr id="semester-row">
            <td class="semester" *ngFor="let sm of semesters" [style.height.px]="cardHeight">
              <div class="card">
                <div class="card-content">
                  <span class="card-title">{{ sm.name }}</span>
                  <div class="semester-div" [dragula]="'semester'" [dragulaModel]="sm.courses">
                    <div class="chip" *ngFor="let course of sm.courses" [innerHtml]="course"></div>
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
    
    <div class="fixed-action-btn">
      <a class="btn-floating btn-large">
        <i class="large material-icons">menu</i>
      </a>
      <ul>
        <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
        <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
        <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
      </ul>
    </div>
  `,
  styleUrls: [ "app/components/semester.component.css" ]
})
export class SemesterComponent implements OnInit {
  
  @Output()
  onNext = new EventEmitter();
  
  semesters: Array<any> = [ { name: "Semester 1", courses: [] } ];
  cardHeight: number;
  
  constructor(private dragulaService: DragulaService, private userService: UserService) { 
    this.cardHeight = 0;
    
    dragulaService.drop.subscribe((value: any) => {
      console.log(value[1].innerHTML);
      // TODO move between course arrays
      
      this.recalculateHeight();
    });
    dragulaService.drag.subscribe((value: any) => {
      this.recalculateHeight();
    });
  }
  
  next() {
    this.onNext.emit();
  }
  
  ngOnInit() {
    for (let c of this.userService.getTakenCourseCodes()) {
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
