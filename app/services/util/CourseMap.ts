export class CourseMap {
  private courses: { [id: number]: CourseModel } = {};
  
  add(course: CourseModel) {
    this.courses[course.CID] = course;
  }
  
  getById(cid: number) {
    return this.courses[cid];
  }
  
  asArray() {
    return Object.values(this.courses);
  }
}