import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { CourseModel } from '../models/course.model';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'takencourses',
    template: `
	<footer>
		<div class="container">
			<div class="row taken-courses">
				<div class="col s12">
					<course-chip [course]="c" [closeable]="true" (onClose)="unsetTaken($event)" 
              *ngFor="let c of takenCourses | async"></course-chip>
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
export class TakenCoursesComponent implements OnInit {
	takenCourses: Observable<CourseModel[]>;
  
	constructor(private courseService: CoursesService) { }
	
  ngOnInit() {
    this.takenCourses = this.courseService.getTakenCourses();
  }
  
	private unsetTaken(course: CourseModel) {
		this.courseService.unsetAsTaken(course);
	}
	
}
