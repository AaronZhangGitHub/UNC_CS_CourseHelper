import { Http }    from '@angular/http';
import { Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserService } from './user.service';

@Injectable()
export class CoursesService {
	private coursesByCategory: { [id: string] : CourseModel[] } = {};
	
	constructor(private http: Http, private userService: UserService) {
		this.addCourse(new CourseModel("Introduction", "COMP 401", "Introduction to CS", [ "COMP 401" ], [ ]));
    this.addCourse(new CourseModel("Introduction", "MATH 233", "Multivariable Calculus", [ "MATH 233" ], [ ]));
		
		this.addCourse(new CourseModel("Fundamentals", "COMP 410", "Data Structures", [ "COMP 410" ], [ "COMP 401" ]));
		this.addCourse(new CourseModel("Fundamentals", "COMP 411", "Computer Organization", [ "COMP 411" ], [ "COMP 401" ]));
		
		this.addCourse(new CourseModel("Distributed Systems", "COMP 431", "Internet Services and Protocols", [ "COMP 431", "INTRO DS" ], [ "COMP 410", "COMP 411" ]));
		this.addCourse(new CourseModel("Distributed Systems", "COMP 530", "Operating Systems", [ "COMP 530", "INTRO DS" ], [ "COMP 410", "COMP 411" ]));
		this.addCourse(new CourseModel("Distributed Systems", "COMP 533", "Distributed Systems", [ "COMP 533" ], [ "INTRO DS" ]));
    
    this.addCourse(new CourseModel("Bio", "COMP 555", "BioAlgorithms", [ "COMP 555" ], [ "COMP 410" ]));
    
    this.addCourse(new CourseModel("Graphics", "MATH 547", "Linear Algebra", [ "MATH 547" ], [ "MATH 233" ]));
    this.addCourse(new CourseModel("Graphics", "COMP 572", "Graphics", [ "COMP 572" ], [ "MATH 547", "COMP 410" ]));
	}
	
	private addCourse(c: CourseModel) {
		var categ = this.coursesByCategory[c.category];
		if (!categ) {
			this.coursesByCategory[c.category] = [ c ];
		} else {
			categ.push(c);
		}
	}
	
	getCourses(): Promise<CourseModel[][]> {
		return new Promise<CourseModel[][]>((resolve, reject) => {
			var res: CourseModel[][] = [ ];
			for (let key in this.coursesByCategory) {
				let categ = this.coursesByCategory[key];
				categ = categ.filter(c => c.isShowing(this.userService));
				if (categ.length > 0) res.push(categ);
			}
			
			resolve(res);
		});
	}
}