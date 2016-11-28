import { Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { SemesterModel } from '../models/semester.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {
	private taken_courses: { [id: string]: CourseModel } = {};
  private semesters: SemesterModel[] = [ new SemesterModel("Semester 1") ];
  
	private equivalent_prereqs: { [id: number]: number } = {};
	
	private subjectPrereqsChange = new Subject<{ add: boolean, course: CourseModel }>();
	public prereqsChange = this.subjectPrereqsChange.asObservable();
	
	hasTaken(course_code: string) {
		return !!this.taken_courses[course_code];
	}
	
	hasEquivalent(prereq_code: number) {
		let equ_count = this.equivalent_prereqs[prereq_code];
		return equ_count > 0;
	}
	
	setTaken(course: CourseModel) {
    if (this.taken_courses.hasOwnProperty(course.code)) return;
  
    // TODO callback to server to set as taken, should return avaliable but untaken courses
  
    this.semesters[0].addCourse(course);
		this.taken_courses[course.code] = course;
		for (let equ_group of course.equivalence_groups) {
			let old_equ_count = this.equivalent_prereqs[equ_group];
			if (old_equ_count > 0) this.equivalent_prereqs[equ_group] += 1;
			else this.equivalent_prereqs[equ_group] = 1;
		}
		
		this.subjectPrereqsChange.next({ add: true, course: course });
	}
	
	unsetTaken(course_code: string) {
    if (!this.taken_courses.hasOwnProperty(course_code)) return;
  
    // TODO callback to server to unset course as taken, should return remaining taken courses
  
		let course = this.taken_courses[course_code];
    for (let s of this.semesters) {
      if (s.removeCourse(course)) break;
    }
    
    for (let equ of course.equivalence_groups) {
      let old_equ_count = this.equivalent_prereqs[equ];
      if (old_equ_count > 0) this.equivalent_prereqs[equ] -= 1;
    }
    
    delete this.taken_courses[course_code];
    
    this.subjectPrereqsChange.next({ add: false, course: course });
	}
  
  getCourseSemesters(): SemesterModel[] {
    return this.semesters;
  }
  
  postCourseSemesters(semester: SemesterModel[]) {
    this.semesters = semester;
    // TODO persist to server
  }
	
	getTakenCourses() : CourseModel[] {
		return Object.values(this.taken_courses);
	}
}