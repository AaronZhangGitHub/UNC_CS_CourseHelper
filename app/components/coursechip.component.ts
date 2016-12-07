import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'course-chip',
    template: `
  <div class="chip white-text darken-2" [class.crossout]="crossout" [ngClass]="course.categoryColor" (dblclick)="onDoubleClick()">
    {{ course.code }}
    <i class="close material-icons" *ngIf="closeable" (click)="onClickClose()">close</i>
  </div>
	`,
  styles: [`
    .chip {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    .crossout {
      text-decoration: line-through;
    }
  `]
})
export class CourseChipComponent {
	@Input()
	course: CourseModel;
  
  @Input()
  closeable: boolean;

  @Input()
  crossout: boolean;
	
	@Output()
	onClose = new EventEmitter<CourseModel>();
  
  constructor(private courseService: CoursesService) { }
	
	private onClickClose() {		
		if (this.closeable) this.onClose.emit(this.course);
	}

  private onDoubleClick() {
    this.courseService.requestDetailsPopup(this.course);
  }
}
