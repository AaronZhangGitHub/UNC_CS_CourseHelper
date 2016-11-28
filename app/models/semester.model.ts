import { CourseModel } from './course.model';

export class SemesterModel {

  constructor(public name: string, public readonly courses: CourseModel[] = []) { }  
  
  addCourse(c: CourseModel): boolean {
    this.courses.push(c);
    return true;
  }
  
  removeCourse(c: CourseModel): boolean {
    let idx = this.courses.indexOf(c);
    if (idx >= 0) {
      this.courses.splice(idx, 1);
      return true;
    } else {
      return false;
    }
  }
  
}