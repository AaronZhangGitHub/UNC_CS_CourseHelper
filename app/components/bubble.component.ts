import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../services/user.service';
import { IBubble } from '../models/IBubble';

@Component({
    selector: 'bubble',
    template: `
	<div class="col s12 m6 l4" *ngIf="model.show(userService)">
		<div class="card cyan darken-4" (click)="onClick()">
			<div class="card-content white-text">
				<span class="card-title">{{model.getTitle()}}</span>
				<p>{{model.getText()}}</p>
			</div>
		</div>
	</div>
	`
})
export class BubbleComponent {
	@Input()
	model: IBubble;
	
	@Output()
	clicked = new EventEmitter<IBubble>();
	
	constructor(private userService: UserService) { }
	
	private onClick() {
		console.log("You clicked bubble with title " + this.model.getTitle());
		
		this.clicked.emit(this.model);
	}
}
