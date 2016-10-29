import { Component , OnInit } from '@angular/core';
import { CourseModel } from './models/course.model';
import { CoursesService } from './services/courses.service';
import { UserService } from './services/user.service';

@Component({
    selector: 'my-app',
    template: `
		<coursescontainer *ngFor="let cs of coursesMatrix" [courses]="cs" (courseClicked)="onCourseClicked($event)"></coursescontainer>
		<takencourses></takencourses>
	`
})
export class AppComponent implements OnInit {
	coursesMatrix: CourseModel[][];
	
	constructor(private courseService: CoursesService, private userService: UserService) { }
	
	ngOnInit() {
		this.coursesMatrix = this.courseService.getCoursesAsMatrix();
	}
	
	onCourseClicked(course: CourseModel) {
		console.log("You clicked course with code " + course.code);
		
		this.userService.setTaken(course);
	}
}
