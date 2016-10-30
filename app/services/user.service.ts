import { Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {
	private taken_courses: { [id: string]: CourseModel } = {};
	private equivalent_prereqs: { [id: string]: number } = {};
	
	private subjectPrereqsChange = new Subject();
	public prereqsChange = this.subjectPrereqsChange.asObservable();
	
	hasTaken(course_code: string) {
		return !!this.taken_courses[course_code];
	}
	
	hasEquivalent(course_code: string) {
		let equ_count = this.equivalent_prereqs[course_code];
		return equ_count > 0;
	}
	
	setTaken(course: CourseModel) {
		this.taken_courses[course.code] = course;
		for (let equ_group of course.equivalence_groups) {
			let old_equ_count = this.equivalent_prereqs[equ_group];
			if (old_equ_count > 0) this.equivalent_prereqs[equ_group] += 1;
			else this.equivalent_prereqs[equ_group] = 1;
		}
		
		this.subjectPrereqsChange.next();
	}
	
	unsetTaken(course_code: string) {
		let course = this.taken_courses[course_code];
		if (course) {
			for (let equ of course.equivalence_groups) {
				let old_equ_count = this.equivalent_prereqs[equ];
				if (old_equ_count > 0) this.equivalent_prereqs[equ] -= 1;
			}
			
			delete this.taken_courses[course_code];
		}
		
		this.subjectPrereqsChange.next();
	}
	
	getTakenCourseCodes() {
		return Object.keys(this.taken_courses);
	}
}