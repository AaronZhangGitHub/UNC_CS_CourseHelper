import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { UserService } from '../services/user.service';
import { CourseModel } from '../models/course.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'coursescontainer',
    template: `
	<span *ngIf="coursesMatrix.length">
		<ul class="collection">
			<li class="collection-item" *ngFor="let courses of coursesMatrix">
				<div class="row">
					<course *ngFor="let c of courses" [model]="c" (clicked)="onCourseClicked($event)"></course>
				</div>
			</li>
		</ul>
	</span>
	`,
	styles: [`
		.row {
			margin: 0px;
		}
	`]
})
export class CoursesContainerComponent implements OnInit, OnDestroy {
	
	private coursesMatrix: CourseModel[][];
	private subscription: Subscription;
	
	constructor(private userService: UserService, private coursesService: CoursesService) {
		this.subscription = userService.prereqsChange.subscribe(() => this.refreshCourses());
	}
	
	private refreshCourses() {
		this.coursesMatrix = this.coursesService.getCourses()
	}
	
	private onCourseClicked(course: CourseModel) {
		this.userService.setTaken(course);
	}
	
	ngOnInit() {
		this.refreshCourses();
	}
	
	ngOnDestroy() {
		// prevent memory leak when component destroyed
		this.subscription.unsubscribe();
	}
}
