import { CourseModel } from '../../models/course.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

export class EQClassesTracker {
  private _onChange: BehaviorSubject<EQClassesTracker>;
  private eqClasses: { [id: number]: EQClassTracker } = {};
  
  constructor() {
    this._onChange = new BehaviorSubject(this);
  }
  
  asObservable(): Observable<EQClassesTracker> {
    return this._onChange.asObservable();
  }
  
  private getTracker(eqcode: number): EQClassTracker {
    if (this.eqClasses[eqcode]) {
      return this.eqClasses[eqcode];
    } else {
      let tracker = new EQClassTracker();
      this.eqClasses[eqcode] = tracker;
      return tracker;
    }
  }
  
  addCourse(course: CourseModel) {
    let changed = false;
    for (let eqcode of course.eqcodes) {
      let tracker = this.getTracker(eqcode);
      if (tracker.addCourse(course)) {
        changed = true;
      }
    }
    
    if (changed) this._onChange.next(this);
  }
  
  removeCourse(course: CourseModel) {
    let changed = false;
    for (let eqcode of course.eqcodes) {
      let tracker = this.getTracker(eqcode);
      if (tracker.removeCourse(course)) {
        changed = true;
      }
    }
    
    if (changed) this._onChange.next(this);
  }
  
  hasCoursesFor(course: CourseModel): boolean {
    for (let pr_code of course.prereq_eqcodes) {
      if (pr_code === 0) continue;
    
      let tracker = this.getTracker(pr_code);
      if (!tracker.hasOne()) return false;
    }
    return true;
  }
  
}

// Private utility class
class EQClassTracker {
  private matchedCID: { [id: number]: boolean } = {};
  
  // Update to include the given course, return true if updating made a change
  addCourse(course: CourseModel): boolean {
    if (!this.matchedCID[course.CID]) {
      this.matchedCID[course.CID] = true;
      return true;
    } else {
      return false;
    }
  }
  
  // Update to exclude a given course, return true if updating made a change
  removeCourse(course: CourseModel): boolean {
    if (this.matchedCID[course.CID]) {
      delete this.matchedCID[course.CID];
      return true;
    } else {
      return false;
    }
  }
  
  hasOne() {
    return Object.keys(this.matchedCID).length > 0;
  }
}