import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CourseModel } from '../models/course.model';
import { UserModel } from '../models/user.model';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

class EQClassesTracker {
  private _onChange: BehaviorSubject<EQClassesTracker>;
  private eqClasses: { [id: number]: EQClassTracker } = {};
  
  constructor() {
    this._onChange = new BehaviorSubject(this);
  }
  
  public asObservable(): Observable<EQClassesTracker> {
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
  
  public addCourse(course: CourseModel) {
    let changed = false;
    for (let eqcode of course.eqcodes) {
      let tracker = this.getTracker(eqcode);
      if (tracker.addCourse(course)) {
        changed = true;
      }
    }
    
    if (changed) this._onChange.next(this);
  }
  
  public removeCourse(course: CourseModel) {
    let changed = false;
    for (let eqcode of course.eqcodes) {
      let tracker = this.getTracker(eqcode);
      if (tracker.removeCourse(course)) {
        changed = true;
      }
    }
    
    if (changed) this._onChange.next(this);
  }
  
  public hasCoursesFor(course: CourseModel): boolean {
    for (let pr_code of course.prereq_eqcodes) {
      if (pr_code === 0) continue;
    
      let tracker = this.getTracker(pr_code);
      if (!tracker.hasOne()) return false;
    }
    return true;
  }
  
}

class EQClassTracker {
  private matchedCID: { [id: number]: boolean } = {};
  
  // Update to include the given course, return true if updating made a change
  public addCourse(course: CourseModel): boolean {
    if (!this.matchedCID[course.CID]) {
      this.matchedCID[course.CID] = true;
      return true;
    } else {
      return false;
    }
  }
  
  // Update to exclude a given course, return true if updating made a change
  public removeCourse(course: CourseModel): boolean {
    if (this.matchedCID[course.CID]) {
      delete this.matchedCID[course.CID];
      return true;
    } else {
      return false;
    }
  }
  
  public hasOne() {
    return Object.keys(this.matchedCID).length > 0;
  }
}

@Injectable()
export class CoursesService {  
  // Mutable properties of courses
  private _courses: ReplaySubject<CourseModel[]>;
  get courses() { return this._courses.asObservable(); }
  
  private planToTakeCourses: { [id: number]: boolean } = {};
  
  private takenCourses: { [id: number]: boolean } = {};
  private courseSemester: { [id: number]: number } = {};
  private takenEQClass: EQClassesTracker;
  
  // Observable to invoke to request the course details popup
  private subjectCourseDetailsPopup = new Subject<CourseModel>();  
	public courseDetailsPopupReq = this.subjectCourseDetailsPopup.asObservable();
	
	constructor(private http: Http, private userService: UserService) {   
    this.takenEQClass = new EQClassesTracker();
  
    this._courses = new ReplaySubject(1);  
    this.loadAllCourses().subscribe((courses: CourseModel[]) => this._courses.next(courses));
	}
  
  private loadAllCourses(): Observable<CourseModel[]> {
    return this.http.get("/api/Class").map((res:Response) => {
      let arr: CourseModel[] = [];
      let json = res.json() || [];
      
      for (let c_json of json) {
        arr.push(this.parseCourse(c_json));
      }
      
      return arr;
    });
  }
  
  private extractData(res: Response) {
    return res.json() || { };
  }
  
  /// Utility to convert json version of a course to a TypeScript Model Object
  private parseCourse(c: any): CourseModel  {
    let cid = c.CID;
    let main_categ = c.Categories.length > 0 ? c.Categories[0].Name : "Other";
    let alt_categ = c.Categories.length > 1 ? c.Categories[1].Name : "";
    let code = c.Name.split(":")[0];
    let short_desc = c.Name.split(":")[1].trim();
    let full_desc = c.Description;
    let eq_groups = c.EQClasses.map((c: { EQClass: number }) => c.EQClass);
    let prereqs = c.Prerequisites.map((c: { EQClass: number }) => c.EQClass);
    
    return new CourseModel(cid, main_categ, alt_categ, code, short_desc, full_desc, eq_groups, prereqs);
  }
  
  getById(cid: number): Promise<CourseModel> {
    return new Promise<CourseModel>((resolve, reject) => {
      // Once courses are loaded, search through them and try to find the given cid
      this.courses.take(1).subscribe((courses: CourseModel[]) => {
        for (let course of courses) {
          if (course.CID == cid) {
            resolve(course);
            return;
          }
        }
        
        reject();
      });
    });
  }
  
  hasTaken(course: CourseModel): boolean {
    if (course == null) return false;
    else return !!this.takenCourses[course.CID];
  }
  
  setAsTaken(course: CourseModel, semester: number) {  
    if (this.takenCourses[course.CID]) return;
    
    // Update cache    
    this.takenCourses[course.CID] = true;
    this.courseSemester[course.CID] = semester;
    
    // Update equivalence codes and notify view
    this.takenEQClass.addCourse(course);
    
    // Postback
    this.userService.getUser().then((user: UserModel) => {
      this.http.post("/api/ClassesTaken", {
        User: user.UID,
        Class: course.CID,
        Semester: semester
      }).subscribe(
        (res: Response) => {},
        (err: any) => alert(err)
      );
    });
  }
  
  unsetAsTaken(course: CourseModel) {
    if (!this.takenCourses[course.CID]) return;
  
    // Update cache
    this.takenCourses[course.CID] = false;
    
    // Update equivalence codes and notify view
    this.takenEQClass.removeCourse(course);
    
    // Postback
    let semester = this.courseSemester[course.CID];
    this.userService.getUser().then((user: UserModel) => {
      this.http.delete(`/api/ClassesTaken/${course.CID},${user.UID},${semester}`);
    });
  }
  
  setSemester(course: CourseModel, semester: number) {
    // TODO
  }
	
  /// Get all active courses sorted by category
	getAvailableCourses(): Observable<CourseModel[][]> {
    return Observable.create((observer: Observer<CourseModel[][]>) => {
      // Will update each time the taken EQ classes changes
      this.takenEQClass.asObservable().subscribe((takenEQClass: EQClassesTracker) => {
        // Wait for courses to be loaded
        this.courses.take(1).subscribe((courses: CourseModel[]) => {
          let categories: { [id: string]: CourseModel[] } = {};
          for (let course of courses) {
            if (!this.hasTaken(course) && takenEQClass.hasCoursesFor(course)) {
              let my_cat = categories[course.category];
              if (!my_cat) {
                my_cat = [];
                categories[course.category] = my_cat;
              }
              
              my_cat.push(course);
            }
          }
          
          observer.next(Object.values(categories));
        });
      });
    });
	}
  
  // Get taken courses (unsorted)
  getTakenCourses(): Observable<CourseModel[]> {
    return Observable.create((observer: Observer<CourseModel[]>) => {
      // Will update each time the taken EQ classes changes
      this.takenEQClass.asObservable().subscribe(() => {
        // Wait for courses to be loaded
        this.courses.take(1).subscribe((courses: CourseModel[]) => {
          let res: CourseModel[] = [];
          for (let course of courses) {
            if (this.hasTaken(course)) res.push(course);
          }
          
          observer.next(res);
        });
      });
    });
	}
  
  /// Find courses by name (autocomplete)
  findCourses(text: string, limit: number = 10): Observable<CourseModel[]> {
    return Observable.create((observer: Observer<CourseModel[]>) => {
      this.courses.take(1).subscribe((courses: CourseModel[]) => {
        if (text.length == 0) return [];
        text = text.toLowerCase();
      
        var res: CourseModel[] = [];
        for (let course of courses) {
          if (course.code.toLowerCase().includes(text) || course.desc.toLowerCase().includes(text)) {
            res.push(course);
            
            if (res.length >= limit) break;
          }
        }
        
        observer.next(res);
      });
    });
  }
  
  /// Get the prereqs (from DB) for a given course, where at least one is required from each inner array
  getPrereqs(course: CourseModel): Observable<CourseModel[][]> {
    if (course == null) return null;
  
    return this.http.get(`/api/prereqs/${course.CID}`).map(
        (res: Response) => {  
          let prereq_groups = res.json() || [[]];
          return prereq_groups.map((g: any[]) => g.map((c: any) => this.parseCourse(c)));
        }
      );
  }
  
  /// Call to broadcast a request for details to be shown on a given course
  requestDetailsPopup(c: CourseModel) {
    if (c == null) return;  
    this.subjectCourseDetailsPopup.next(c);
  }
}