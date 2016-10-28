import { Component, Input } from '@angular/core';
import { BubbleModel } from '../models/bubble.model';

@Component({
    selector: 'bubblecontainer',
    template: `
	<div class="row bubble-container" *ngIf="hasOne()">
		<bubble *ngFor="let b of bubbles" [model]="b"></bubble>
	</div>
	`
})
export class BubbleContainerComponent {
	@Input() bubbles: BubbleModel[];
	
	hasOne(): boolean {
		for (let b of this.bubbles) {
			if (b.hasPrereqs(null)) return true;
		}
		
		return false;
	}
}
