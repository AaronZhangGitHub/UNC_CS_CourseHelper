import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CourseModel } from '../models/course.model';
import { EQClassesTracker } from './util/EQClassesTracker';
import { CourseSemesterTracker } from './util/CourseSemesterTracker';
import { CourseMap } from './util/CourseMap';
import { UserModel, UserTakenCourseModel } from '../models/user.model';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

@Injectable()
export class CoursesService {  
  // Mutable properties of courses
  private _courses: BehaviorSubject<CourseMap>;
  
  private takenCourses: { [id: number]: boolean } = {};
  private courseSemesters: CourseSemesterTracker;
  private takenEQClass: EQClassesTracker;
  
  private planToTakeCourses: { [id: number]: boolean } = {};
  
  // Observable to invoke to request the course details popup
  private subjectCourseDetailsPopup = new Subject<CourseModel>();  
	public courseDetailsPopupReq = this.subjectCourseDetailsPopup.asObservable();
	
	constructor(public http: Http, public userService: UserService) {   
    this.takenEQClass = new EQClassesTracker();
    this.courseSemesters = new CourseSemesterTracker(this);
  
    this._courses = new BehaviorSubject(null);
    this.loadAllCourses().subscribe((courses: CourseModel[]) => {
      let map = new CourseMap();
      for (let course of courses) map.add(course);
      
      this._courses.next(map);
    });
    
    // Load already taken courses
    this.userService.getUser().subscribe((user: UserModel) => {
      user.ClassesTaken.forEach((taken_course: UserTakenCourseModel) => {
        this.getById(taken_course.Class).then((course: CourseModel) => {
          this.setAsTaken(course, taken_course.Semester, false);
        });
      });
    });
	}
  
  /// Get courses (once), once they have loaded
  getCourses(): Observable<CourseMap> {
    return this._courses.asObservable().filter((courses: CourseMap) => courses != null).take(1);
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
      this.getCourses().subscribe((courses: CourseMap) => {
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
  
  setAsTaken(course: CourseModel, semester: number = 0, postback: boolean = true) {  
    if (this.takenCourses[course.CID]) return;
    
    // Update cache    
    this.takenCourses[course.CID] = true;
    
    // Update equivalence codes and notify view (order here matters)
    this.takenEQClass.addCourse(course);
    this.courseSemesters.setCourseSemester(course, semester);
    
    if (postback) {
      // Postback
      this.userService.getUser().subscribe((user: UserModel) => {
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
    this.userService.getUser().subscribe((user: UserModel) => {
      this.http.delete(`/api/ClassesTaken/${course.CID},${user.UID},${semester}`);
    });
  }
  
  getCourseSemestersAsObservable(): Observable<CourseModel[][]> {
    return this.courseSemesters.asObservable();
  }
  
  addSemester() {
    this.courseSemesters.addEmptySemester();
  }
  
  setSemester(course: CourseModel, semester: number) {
    this.courseSemesters.setCourseSemester(course, semester);
  }
  
  /// Force courses into the given semesters
  forceCourseSemesters(semesters: CourseModel[][]) {
    this.courseSemesters.forceCourseSemesters(semesters);
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
        this.getCourses().subscribe((courses: CourseMap) => {
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
        this.getCourses().subscribe((courses: CourseMap) => {
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
      this.getCourses().subscribe((courses: CourseMap) => {
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