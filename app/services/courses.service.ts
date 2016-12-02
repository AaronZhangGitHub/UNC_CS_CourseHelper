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

class CourseSemesterTracker {
  private _onChange: BehaviorSubject<CourseModel[][]>;
  private courseSemester: { [id: number]: number } = {};
  // TODO store in array so don't get reordered
  private maxSemester: number;
  
  constructor(private courseService: CoursesService) {
    this._onChange = new BehaviorSubject([[]]);
    this.maxSemester = 1;
  }
  
  getCourseSemesters(): Observable<CourseModel[][]> {
    return this._onChange.asObservable();
  }
  
  addEmptySemester() {
    // Limit to 8 semesters
    if (this.maxSemester < 8) {
      this.maxSemester += 1;
      this.emitChange();
    }
  }
  
  removeSemester(remove_id: number) {
    // Can't remove last semester
    if (this.maxSemester > 1) {
      let new_id = Math.max(remove_id-1, 1);
      for (let key in this.courseSemester) {
        let this_id = this.courseSemester[key];
        if (this_id == remove_id) {
          this.courseSemester[key] = new_id;
        } else if (this_id > remove_id) {
          this.courseSemester[key] = this_id-1;
        }
      }
      
      this.maxSemester -= 1;      
      this.emitChange();
    }
  }
  
  getCourseSemester(course: CourseModel) {
    return this.courseSemester[course.CID];
  }
  
  setCourseSemester(course: CourseModel, semester: number) {
    if (this.forceCourseSemester(course, semester)) {
      this.emitChange();
    }
  }
  
  bulkSetCourseSemesters(semesters: CourseModel[][]) {
    let changed = false;
    for (let key in semesters) {
      let semester_id = parseInt(key) + 1;
      let courses = semesters[key];
      for (let course of courses) {
        if (this.forceCourseSemester(course, semester_id)) {
          changed = true;
        }
      }
    }
    
    if (changed) {
      this.emitChange();
    }
  }
  
  private forceCourseSemester(course: CourseModel, semester: number): boolean {
    semester = ~~semester; // Make sure is int
    
    if (this.courseSemester[course.CID] !== semester) {
      if (semester > this.maxSemester) this.maxSemester = semester;
    
      this.courseSemester[course.CID] = semester;
      return true;
    } else {
      return false;
    }
  }
  
  removeCourse(course: CourseModel) {
    if (this.courseSemester.hasOwnProperty(course.CID)) {
      delete this.courseSemester[course.CID];
      
      this.emitChange();
    }
  }
  
  getMaxCoursesInSemester(): number {
    let maxVal = 0;
  
    let arr: number[] = [];
    for (let semester of Object.values(this.courseSemester)) {
      let newVal = arr[semester] ? arr[semester]+1 : 1;
      arr[semester] = newVal;
      
      if (newVal > maxVal) maxVal = newVal;
    }
    
    return maxVal;
  }
  
  private emitChange() {
    this.getCoursesBySemester().then((cs: CourseModel[][]) => this._onChange.next(cs));
  }
  
  private getCoursesBySemester(): Promise<CourseModel[][]> {   
    // Load courses async
    let loading_courses: Promise<CourseModel>[] = [];
    for (let cid of Object.keys(this.courseSemester)) {
      loading_courses.push(this.courseService.getById(parseInt(cid)));
    }

    return new Promise((resolve, reject) => {
      Promise.all(loading_courses).then((courses: CourseModel[]) => {
        // Create all inner arrays for all semesters
        let res: CourseModel[][] = [];
        for (let i = 1; i <= this.maxSemester; i++) {
          res.push([]);
        }
        
        // Add all loaded semesters to the correct semester
        for (let course of courses) {
          let semester = this.courseSemester[course.CID];
          res[semester-1].push(course);
        }
        
        resolve(res);
      });
    });
  }
}

class CourseMap {
  private courses: { [id: number]: CourseModel } = {};
  
  add(course: CourseModel) {
    this.courses[course.CID] = course;
  }
  
  getById(cid: number) {
    return this.courses[cid];
  }
  
  asArray() {
    return Object.values(this.courses);
  }
}

@Injectable()
export class CoursesService {  
  // Mutable properties of courses
  private _courses: ReplaySubject<CourseMap>;
  get courses() { return this._courses.asObservable(); }
  
  private takenCourses: { [id: number]: boolean } = {};
  private courseSemesters: CourseSemesterTracker;
  private takenEQClass: EQClassesTracker;
  
  private planToTakeCourses: { [id: number]: boolean } = {};
  
  // Observable to invoke to request the course details popup
  private subjectCourseDetailsPopup = new Subject<CourseModel>();  
	public courseDetailsPopupReq = this.subjectCourseDetailsPopup.asObservable();
	
	constructor(private http: Http, private userService: UserService) {   
    this.takenEQClass = new EQClassesTracker();
    this.courseSemesters = new CourseSemesterTracker(this);
  
    this._courses = new ReplaySubject(1);  
    this.loadAllCourses().subscribe((courses: CourseModel[]) => {
      let map = new CourseMap();
      for (let course of courses) map.add(course);
      
      this._courses.next(map);
    });
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
      this.courses.take(1).subscribe((courses: CourseMap) => {
        let course = courses.getById(cid);
        if (course) resolve(course);
        else reject();
      });
    });
  }
  
  hasTaken(course: CourseModel): boolean {
    if (course == null) return false;
    else return !!this.takenCourses[course.CID];
  }
  
  setAsTaken(course: CourseModel, semester: number = 1) {  
    if (this.takenCourses[course.CID]) return;
    
    // Update cache    
    this.takenCourses[course.CID] = true;
    
    // Update equivalence codes and notify view (order here matters)
    this.takenEQClass.addCourse(course);
    this.courseSemesters.setCourseSemester(course, semester);
    
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
  
    let semester = this.courseSemesters.getCourseSemester(course);
  
    // Update cache
    this.takenCourses[course.CID] = false;
    
    // Update equivalence codes and notify view
    this.takenEQClass.removeCourse(course);
    this.courseSemesters.removeCourse(course);
    
    // Postback
    this.userService.getUser().then((user: UserModel) => {
      this.http.delete(`/api/ClassesTaken/${course.CID},${user.UID},${semester}`);
    });
  }
  
  getCourseSemesters(): Observable<CourseModel[][]> {
    return this.courseSemesters.getCourseSemesters();
  }
  
  addSemester() {
    this.courseSemesters.addEmptySemester();
  }
  
  setSemester(course: CourseModel, semester: number) {
    this.courseSemesters.setCourseSemester(course, semester);
  }
  
  /// Force courses into the given semesters
  bulkSetCourseSemesters(semesters: CourseModel[][]) {
    this.courseSemesters.bulkSetCourseSemesters(semesters);
  }
  
  removeSemester(id: number) {
    this.courseSemesters.removeSemester(id);
  }
  
  getMaxCoursesInSemester(): number {
    return this.courseSemesters.getMaxCoursesInSemester();
  }
	
  /// Get all active courses sorted by category
	getAvailableCourses(): Observable<CourseModel[][]> {
    return Observable.create((observer: Observer<CourseModel[][]>) => {
      // Will update each time the taken EQ classes changes
      this.takenEQClass.asObservable().subscribe((takenEQClass: EQClassesTracker) => {
        // Wait for courses to be loaded
        this.courses.take(1).subscribe((courses: CourseMap) => {
          let categories: { [id: string]: CourseModel[] } = {};
          for (let course of courses.asArray()) {
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
        this.courses.take(1).subscribe((courses: CourseMap) => {
          let res: CourseModel[] = [];
          for (let course of courses.asArray()) {
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
      this.courses.take(1).subscribe((courses: CourseMap) => {
        if (text.length == 0) return [];
        text = text.toLowerCase();
      
        var res: CourseModel[] = [];
        for (let course of courses.asArray()) {
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