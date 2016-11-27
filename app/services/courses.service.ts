import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CourseModel } from '../models/course.model';
import { UserService } from './user.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class CoursesService {
	private coursesByCategory: { [id: string] : CourseModel[] } = {};
  
  private coursesLoaded = false;
  private subjectLoadedCourses = new Subject();
  
  private subjectCourseDetailsPopup = new Subject<CourseModel>();  
	public courseDetailsPopupReq = this.subjectCourseDetailsPopup.asObservable();
	
	constructor(private http: Http, private userService: UserService) {    
    this.http.get("/api/Class").map(
        (res: Response) => { 
          return res.json() || { }; 
        }
      ).subscribe(
        (all_courses: any[]) => { 
          for (let c of all_courses) {
            console.log(c);
            if (c.Categories.length == 0) continue;
            
            let main_categ = c.Categories[0].Name;
            let alt_categ = c.Categories.length > 1 ? c.Categories[1].Name : "";
            let code = c.Name.split(":")[0];
            let short_desc = c.Name.split(":")[1].trim();
            let full_desc = c.Description;
            let eq_groups = c.EQClasses.map((c: { EQClass: number }) => c.EQClass);
            let prereqs = c.Prerequisites.map((c: { EQClass: number }) => c.EQClass);
            
            this.addCourse(new CourseModel(main_categ, alt_categ, code, short_desc, full_desc, eq_groups, prereqs));
          }
          
          this.coursesLoaded = true;
          this.subjectLoadedCourses.next();
        },
        (err: any) => { alert(err); }
      );
	}
	
  /// Utility function to add a course to the catelog
	private addCourse(c: CourseModel) {
		var categ = this.coursesByCategory[c.category];
		if (!categ) {
			this.coursesByCategory[c.category] = [ c ];
		} else {
			categ.push(c);
		}
	}
	
  /// Get all active courses sorted by category
	getAvailableCourses(): Promise<CourseModel[][]> {
		return new Promise<CourseModel[][]>((resolve, reject) => {
      if (this.coursesLoaded)
        resolve(this.filterForActiveCourses());
			else
        this.subjectLoadedCourses.subscribe(() => { 
          resolve(this.filterForActiveCourses());
        });
		});
	}
  
  /// Filter loade course for the active ones (the ones the user has taken)
  private filterForActiveCourses() : CourseModel[][] {
    var res: CourseModel[][] = [ ];
    for (let categ of Object.values(this.coursesByCategory)) {
      categ = categ.filter((c: CourseModel) => c.isShowing(this.userService));
      if (categ.length > 0) res.push(categ);
    }
    
    return res;
  }
  
  /// Find courses by name (autocomplete)
  findCourses(text: string, limit: number = 10): CourseModel[] {
    if (text.length == 0) return [];
  
    var res: CourseModel[] = [];
    for (let categ of Object.values(this.coursesByCategory)) {
      for (let course of categ) {
        if (course.code.includes(text) || course.desc.includes(text)) {
          res.push(course);
          
          if (res.length >= limit) break;
        }
      }
    }
    
    return res;
  }
  
  /// Call to broadcast a request for details to be shown on a given course
  requestDetailsPopup(c: CourseModel) {
    if (c == null) return;
  
    this.subjectCourseDetailsPopup.next(c);
  }
}