import { Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { UserService } from './user.service';

@Injectable()
export class CoursesService {
	private coursesByCategory: { [id: string] : CourseModel[] } = {};
	
	constructor(private userService: UserService) {
		this.addCourse(new CourseModel("first_level", "COMP 401", "Introduction to CS", [ ]));
		
		this.addCourse(new CourseModel("second_level", "COMP 410", "Data Structures", [ "COMP 401" ]));
		this.addCourse(new CourseModel("second_level", "COMP 411", "Computer Organization", [ "COMP 401" ]));
	}
	
	private addCourse(c: CourseModel) {
		var categ = this.coursesByCategory[c.category];
		if (!categ) {
			this.coursesByCategory[c.category] = [ c ];
		} else {
			categ.push(c);
		}
	}
	
	getCourses(): CourseModel[][] {
		var res: CourseModel[][] = [ ];
		for (let key in this.coursesByCategory) {
			let categ = this.coursesByCategory[key];
			categ = categ.filter(c => c.isShowing(this.userService));
			if (categ.length > 0) res.push(categ);
		}
	
		return res;
	}
}