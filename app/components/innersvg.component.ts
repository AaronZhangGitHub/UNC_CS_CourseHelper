import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { CourseModel } from '../models/course.model';
require("../../../lines/lines.js");

// After user has created an account and selected their taken courses this is the default page
@Component({
  selector: 'innersvg',
  templateUrl: 'lines/line-thing.html',
  styleUrls: [ 'app/components/home.component.css' ]
})
export class InnerSVGComponent implements AfterViewInit {

  constructor(private courseService: CoursesService) { }

  ngAfterViewInit() {
    (window as any).loadSVG();
  }
  
  open(cid: number) {
    this.courseService.getById(cid).then((course: CourseModel) => {
      this.courseService.requestDetailsPopup(course);
    });
  }
    
}
