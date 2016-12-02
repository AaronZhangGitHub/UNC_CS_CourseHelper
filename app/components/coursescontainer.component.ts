import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { UserService } from '../services/user.service';
import { CourseModel } from '../models/course.model';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'coursescontainer',
    template: `
	<span *ngIf="(coursesMatrix | async)?.length > 0">
    <div class="category-group collection-item" *ngFor="let courses of (coursesMatrix | async)">
      <span class="title">
        <h5>{{courses[0].category}}</h5>
        <hr />
      </span>
      <div class="row">
        <course *ngFor="let c of courses" [model]="c" (clicked)="onCourseClicked($event)"></course>
      </div>
    </div>
	</span>
	`,
	styles: [`
		.row {
			margin: 0px;
		}
	`]
})
export class CoursesContainerComponent {
	private coursesMatrix: Observable<CourseModel[][]>;
	
	constructor(private coursesService: CoursesService) {
    this.coursesMatrix = coursesService.getAvailableCourses();
  }
	
	private onCourseClicked(course: CourseModel) {
		this.coursesService.setAsTaken(course, 0);
	}
}
