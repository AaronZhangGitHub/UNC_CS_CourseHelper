import { Component, Input, Output, EventEmitter, } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { CoursesService } from '../services/courses.service';

@Component({
    selector: 'course',
    template: `
	<div class="col s12 m6 l4">
		<div class="click-card card">
			<div class="card-content darken-2 white-text" [ngClass]="model.categoryColor" (click)="onClick()">
        <span class="badge white-text darken-3" [ngClass]="model.altCategoryColor">{{ model.alt_cat }}</span>
				<span class="card-title">
          {{model.code}}
        </span>
				<p>{{model.desc}}</p>
			</div>
      <div class="card-action">
        <a href="javascript:void(0)" (click)="showDetails()">Details</a>
      </div>
		</div>
	</div>`
})
export class CourseComponent {
	@Input()
	model: CourseModel;
	
	@Output()
	clicked = new EventEmitter<CourseModel>();
  
  constructor(private courseService: CoursesService) { }
	
	private onClick() {		
		this.clicked.emit(this.model);
	}
  
  private showDetails() {
    // Request for the master page to show the details popup for this course
    this.courseService.requestDetailsPopup(this.model);
  }
}
