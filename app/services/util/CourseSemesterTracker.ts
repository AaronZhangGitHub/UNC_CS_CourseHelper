import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CourseModel } from '../../models/course.model';
import { UserModel } from '../../models/user.model';
import { CoursesService } from '../courses.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

export class CourseSemesterTracker {
  private _onChange: BehaviorSubject<CourseModel[][]>;
  private semesters: CourseModel[][];
  
  constructor(private courseService: CoursesService) {
    this.semesters = [ [] ];
    this._onChange = new BehaviorSubject(this.semesters);
  }
  
  asObservable(): Observable<CourseModel[][]> {
    return this._onChange.asObservable();
  }
  
  addEmptySemester() {
    // Limit to 8 semesters
    if (this.semesters.length < 8) {
      this.semesters.push([]);
      this.emitChange();
    }
  }
  
  removeSemester(remove_id: number) {
    // Can't remove last semester
    if (this.semesters.length > 1) {
      let removed: CourseModel[] = this.semesters.splice(remove_id, 1)[0];
      
      let new_id = Math.max(0, remove_id-1);
      for (let course of removed) {
        this.setCourseSemester(course, new_id, false);
      }
  
      this.emitChange();
    }
  }
  
  // Get the [ semester, idx in semester ]
  private getCourseSemesterLocation(course: CourseModel) {
    for (let i = 0, ii = this.semesters.length; i < ii; i++) {
      let semester = this.semesters[i];
      for (let j = 0, jj = semester.length; j < jj; j++) {
        let sc = semester[j];
        if (sc.CID == course.CID) {
          return [ i, j ];
        }
      }
    }
    
    return [ -1, -1 ];
  }
  
  getCourseSemester(course: CourseModel) {
    return this.getCourseSemesterLocation(course)[0];
  }
  
  setCourseSemester(course: CourseModel, idx: number, emit: boolean = true) {
    if (idx < 0 || idx > 10) return; // Invalid
  
    let old_loc = this.getCourseSemesterLocation(course);
    if (old_loc[0] == idx) {
      // If already in correct semester
      return;
    } else if (old_loc[0] >= 0) {
      // Remove from old location
      let old_semester_idx = old_loc[0];
      this.semesters[old_semester_idx].splice(old_loc[1], 1);
      
      this.courseService.userService.getUser().subscribe((user: UserModel) => {
        this.courseService.http.delete(`/api/ClassesTaken/${course.CID},${user.UID}`);
      });
    }
    
    // Create new semesters if need
    while (this.semesters.length <= idx) {
      this.semesters.push([]);
    }
    this.semesters[idx].push(course);
    
    this.courseService.userService.getUser().subscribe((user: UserModel) => {
      this.courseService.http.post("/api/ClassesTaken", {
        User: user.UID,
        Class: course.CID,
        Semester: idx
      });
    });
    
    if (emit) this.emitChange();
  }
  
  /// Force all the semesters for the user
  forceCourseSemesters(semesters: CourseModel[][]) {
    this.courseService.userService.getUser().subscribe((user: UserModel) => {
      for (let idx = 0, ii = semesters.length; idx < ii; idx++) {
        let semester = semesters[idx];
        for (let course of semester) {
          let body = {
            User: user.UID,
            Class: course.CID,
            Semester: idx
          };
          
          let old_idx = this.getCourseSemester(course);
          if (old_idx >= 0) // Already exists
            if (old_idx != idx) // Different
              this.courseService.http.put(`/api/ClassesTaken/${course.CID},${user.UID}`, body)
                .subscribe(() => console.log("ok"));
          else
            this.courseService.http.post("/api/ClassesTaken", body);
        }
      }
      
      this.semesters = semesters;
      this.emitChange();
    });
  }
  
  removeCourse(course: CourseModel) {
    let old_loc = this.getCourseSemesterLocation(course);  
    if (old_loc[0] >= 0) {
      this.semesters[old_loc[0]].splice(old_loc[1], 1);
      
      this.emitChange();
    }
  }
  
  getMaxCoursesInSemester(): number {
    let maxVal = 0;
  
    for (let semester of this.semesters) {      
      if (semester.length > maxVal) maxVal = semester.length;
    }
    
    return maxVal;
  }
  
  private emitChange() {
    // Clone semester to make internal state immutable from outside
    let cloned_semesters: CourseModel[][] = [];
    for (let semester of this.semesters) {
      let cloned_semester: CourseModel[] = [];
      for (let course of semester) {
        cloned_semester.push(course);
      }
      cloned_semesters.push(cloned_semester);
    }
  
    this._onChange.next(cloned_semesters);
  }
}