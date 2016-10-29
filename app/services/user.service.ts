import { Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {
	private taken_courses: { [id: string]: boolean } = {};
	
	private subjectPrereqsChange = new Subject();
	public prereqsChange = this.subjectPrereqsChange.asObservable();
	
	hasTaken(course_code: string) {
		return !!this.taken_courses[course_code];
	}
	
	setTaken(course: CourseModel) {
		this.taken_courses[course.code] = true;
		this.subjectPrereqsChange.next();
	}
	
	unsetTaken(course_code: string) {
		delete this.taken_courses[course_code];
		this.subjectPrereqsChange.next();
	}
	
	getTakenCourseCodes() {
		return Object.keys(this.taken_courses);
	}
}