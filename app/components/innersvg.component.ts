import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
require("../../../lines/lines.js");

// After user has created an account and selected their taken courses this is the default page
@Component({
  selector: 'innersvg',
  templateUrl: 'lines/line-thing.svg',
  styleUrls: [ 'app/components/home.component.css' ]
})
export class InnerSVGComponent implements AfterViewInit {

  ngAfterViewInit() {
    (window as any).loadSVG();
  }
    
}
