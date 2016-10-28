import { Component , OnInit } from '@angular/core';
import { BubbleModel } from './models/bubble.model';
import { CoursesService } from './services/courses.service';

@Component({
    selector: 'my-app',
    template: '<bubblecontainer *ngFor="let bCategory of bubblesMatrix" [bubbles]="bCategory"></bubblecontainer>'
})
export class AppComponent implements OnInit {
	bubblesMatrix: BubbleModel[][];
	
	constructor(private courses_service: CoursesService) { }
	
	ngOnInit() {
		this.bubblesMatrix = this.courses_service.getBubblesAsMatrix();
	}
}
