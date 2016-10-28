import { Component, Input } from '@angular/core';
import { BubbleModel } from '../models/bubble.model';

@Component({
    selector: 'bubble',
    template: `
	<div class="col s12 m6 l4" *ngIf="b.hasPrereqs(null)">
		<div class="card blue-grey">
			<div class="card-content white-text">
				<span class="card-title">{{b.code}}</span>
				<p>{{b.desc}}</p>
			</div>
		</div>
	</div>
	`
})
export class BubbleComponent {
	@Input() b: BubbleModel;
}
