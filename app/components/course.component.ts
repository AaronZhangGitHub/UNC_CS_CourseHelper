import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'course',
    template: `
	<div class="col s12 m6 l4">
		<div class="click-card card cyan darken-4" (click)="onClick()">
			<div class="card-content white-text">
				<span class="card-title">{{model.code}}</span>
				<p>{{model.desc}}</p>
			</div>
		</div>
	</div>
	`
})
export class CourseComponent {
	@Input()
	model: CourseModel;
	
	@Output()
	clicked = new EventEmitter<CourseModel>();
	
	private onClick() {		
		this.clicked.emit(this.model);
	}
}
