import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { UserService } from '../services/user.service';
import { CourseModel } from '../models/course.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'coursescontainer',
    template: `
	<span *ngIf="!initLoad">
		<div class="row">
			<div class="center-align">
				<div class="preloader-wrapper big active">
					<div class="spinner-layer spinner-blue-only">
						<div class="circle-clipper left">
							<div class="circle"></div>
						</div>
						<div class="gap-patch">
							<div class="circle"></div>
						</div>
						<div class="circle-clipper right">
							<div class="circle"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</span>
	
	<span *ngIf="coursesMatrix && coursesMatrix.length">
		<ul class="collection">
			<li class="collection-item" *ngFor="let courses of coursesMatrix">
				<span class="title">
					<h5>{{courses[0].category}}</h5>
					<hr />
				</span>
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
	
	private initLoad = false;
	private coursesMatrix: CourseModel[][];
	private subscription: Subscription;
	
	constructor(private userService: UserService, private coursesService: CoursesService) {
		this.subscription = userService.prereqsChange.subscribe(() => this.refreshCourses());
	}
	
	private refreshCourses() {
		this.coursesService.getCourses().then((coursesMatrix) => {
			this.initLoad = true;
			this.coursesMatrix = coursesMatrix;
		});
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
