import { Component } from '@angular/core';
import { BubbleModel } from './models/bubble.model';

@Component({
    selector: 'my-app',
    template: '<bubblecontainer *ngFor="let bs of allBubbles" [bubbles]="bs"></bubblecontainer>'
})
export class AppComponent {
	allBubbles: BubbleModel[][] = [
		[
			new BubbleModel("COMP 401", "Introduction to CS")
		],
		[
			new BubbleModel("COMP 410", "Data Structures"),
			new BubbleModel("COMP 411", "Computer Organization")
		]
	];
}
