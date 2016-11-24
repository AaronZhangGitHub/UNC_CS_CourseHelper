import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'course',
    template: `
	<div class="col s12 m6 l4">
		<div class="click-card card">
			<div class="card-content darken-2 white-text" [ngClass]="model.getCatColor()" (click)="onClick()">
        <span class="badge white-text darken-3" [ngClass]="model.getAltCatColor()">{{ model.alt_cat }}</span>
				<span class="card-title">
          {{model.code}}
        </span>
				<p>{{model.desc}}</p>
			</div>
      <div class="card-action">
        <a href="javascript:void(0)" (click)="showDetails()">Details</a>
      </div>
		</div>
	</div>
  
  <coursepopup [course]="model" [show]="showPopup"></coursepopup>
	`
})
export class CourseComponent {
	@Input()
	model: CourseModel;
	
	@Output()
	clicked = new EventEmitter<CourseModel>();
  
  showPopup: boolean;
  
  constructor() {
    this.showPopup = false;
  }
	
	private onClick() {		
		this.clicked.emit(this.model);
	}
  
  showDetails() {
    this.showPopup = true;
  }
}
