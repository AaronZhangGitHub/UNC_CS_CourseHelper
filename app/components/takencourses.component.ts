import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'takencourses',
    template: `
	<footer>
		<div class="container">
			<div class="row taken-courses">
				<div class="col s12">
					<course-chip [course]="c" [closeable]="true" (onClose)="unsetTaken($event.code)" *ngFor="let c of getTakenCourses()"></course-chip>
				</div>
			</div>
		</div>
	</footer>`,
	styles: [
		`
		footer {
			bottom: 0;
			position: fixed;
			width: 70%;
		}
		`
	]
})
export class TakenCoursesComponent {
	
	constructor(private userService: UserService) { }
	
	private getTakenCourses(): CourseModel[] {
		return this.userService.getTakenCourses();
	}
	
	private unsetTaken(course_code: string) {
		this.userService.unsetTaken(course_code);
	}
	
}
