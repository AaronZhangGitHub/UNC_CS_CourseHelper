import { Http }    from '@angular/http';
import { Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserService } from './user.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CoursesService {
	private coursesByCategory: { [id: string] : CourseModel[] } = {};
  
  private subjectCourseDetailsPopup = new Subject<CourseModel>();
  
  /// Subscribe to this to be notified when a component requests details on a given course to be shown
	public courseDetailsPopupReq = this.subjectCourseDetailsPopup.asObservable();
	
	constructor(private http: Http, private userService: UserService) {
		this.addCourse(new CourseModel("Introduction", "", "COMP 401", "Introduction to CS", [ "COMP 401" ], [ ]));
    this.addCourse(new CourseModel("Introduction", "", "MATH 233", "Multivariable Calculus", [ "MATH 233" ], [ ]));
		
		this.addCourse(new CourseModel("Fundamentals", "", "COMP 410", "Data Structures", [ "COMP 410" ], [ "COMP 401" ]));
		this.addCourse(new CourseModel("Fundamentals", "", "COMP 411", "Computer Organization", [ "COMP 411" ], [ "COMP 401" ]));
		
		this.addCourse(new CourseModel("Networking", "", "COMP 431", "Internet Services and Protocols", [ "COMP 431", "INTRO DS" ], [ "COMP 410", "COMP 411" ]));
		this.addCourse(new CourseModel("Networking", "Grad School", "COMP 530", "Operating Systems", [ "COMP 530", "INTRO DS" ], [ "COMP 410", "COMP 411" ]));
		this.addCourse(new CourseModel("Networking", "", "COMP 533", "Distributed Systems", [ "COMP 533" ], [ "INTRO DS" ]));
    
    this.addCourse(new CourseModel("Grad School", "App Dev", "COMP 555", "BioAlgorithms", [ "COMP 555" ], [ "COMP 410" ]));
    
    this.addCourse(new CourseModel("Graphics", "", "MATH 547", "Linear Algebra", [ "MATH 547" ], [ "MATH 233" ]));
    this.addCourse(new CourseModel("Graphics", "", "COMP 572", "Graphics", [ "COMP 572" ], [ "MATH 547", "COMP 410" ]));
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
	getCourses(): Promise<CourseModel[][]> {
		return new Promise<CourseModel[][]>((resolve, reject) => {
			var res: CourseModel[][] = [ ];
			for (let categ of Object.values(this.coursesByCategory)) {
				categ = categ.filter((c: CourseModel) => c.isShowing(this.userService));
				if (categ.length > 0) res.push(categ);
			}
			
			resolve(res);
		});
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