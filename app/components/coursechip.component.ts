import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'course-chip',
    template: `
	<div class="chip white-text darken-2" [ngClass]="course.getCatColor()">
    {{ course.code }}
    <i class="close material-icons" *ngIf="closeable" (click)="onClickClose()">close</i>
  </div>
	`
})
export class CourseChipComponent {
	@Input()
	course: CourseModel;
  
  @Input()
  closeable: boolean;
	
	@Output()
	onClose = new EventEmitter<CourseModel>();
  
  constructor() { }
	
	private onClickClose() {		
		if (this.closeable) this.onClose.emit(this.course);
	}
}
