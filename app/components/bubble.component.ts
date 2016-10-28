import { Component, Input } from '@angular/core';
import { BubbleModel } from '../models/bubble.model';

@Component({
    selector: 'bubble',
    template: `
	<div class="col s12 m6 l4" *ngIf="model.hasPrereqs(null)">
		<div class="card blue-grey" (click)="selectBubble()">
			<div class="card-content white-text">
				<span class="card-title">{{model.code}}</span>
				<p>{{model.desc}}</p>
			</div>
		</div>
	</div>
	`
})
export class BubbleComponent {
	@Input() model: BubbleModel;
	
	selectBubble() {
		console.log("You clicked " + this.model.code);
	}
}
