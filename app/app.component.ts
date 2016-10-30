import { Component } from '@angular/core';
import { CourseModel } from './models/course.model';
import { CoursesService } from './services/courses.service';
import { UserService } from './services/user.service';

@Component({
    selector: 'my-app',
    template: `
		<coursescontainer></coursescontainer>
		<takencourses></takencourses>
	`
})
export class AppComponent { }
