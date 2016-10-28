import { Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Injectable()
export class UserService {
	private taken_courses: { [id: string]: boolean } = {};
	
	constructor() { }
	
	hasTaken(course_code: string) {
		return !!this.taken_courses[course_code];
	}
	
	setTaken(course: CourseModel) {
		this.taken_courses[course.code] = true;
	}
}