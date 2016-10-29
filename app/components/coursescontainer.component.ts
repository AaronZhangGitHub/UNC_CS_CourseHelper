import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../services/user.service';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'coursescontainer',
    template: `
	<div class="row">
		<bubble *ngFor="let c of courses" [model]="c" (clicked)="onCourseClicked($event)"></bubble>
	</div>
	`,
	styles: [`
		.row {
			margin: 0px;
		}
		
		.bubble {
			margin-top: 20px;
		}
	`]
})
export class CoursesContainerComponent {
	@Input() 
	courses: CourseModel[];
	
	@Output()
	courseClicked = new EventEmitter<CourseModel>();
	
	constructor(private userService: UserService) { }
	
	hasOne(): boolean {
		for (let c of this.courses) {
			if (c.hasPrereqs(this.userService)) return true;
		}
		
		return false;
	}
	
	private onCourseClicked(course: CourseModel) {
		this.courseClicked.emit(course);
	}
}
