import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
    selector: 'takencourses',
    template: `
	<footer>
		<div class="container">
			<div class="row taken-courses">
				<div class="col s12">
					<div class="chip" *ngFor="let code of getTakenCourseCodes()">
						{{code}}
						<i class="close material-icons" (click)="unsetTaken(code)">close</i>
					</div>
				</div>
			</div>
		</div>
	</footer>
	`
	styles: [
		`
		footer {
			bottom: 0;
			position: fixed;
			width: 70%;
		}
		`
	]
})
export class TakenCoursesComponent {
	
	constructor(private userService: UserService) { }
	
	private getTakenCourseCodes(): string[] {
		return this.userService.getTakenCourseCodes();
	}
	
	private unsetTaken(course_code: string) {
		this.userService.unsetTaken(course_code);
	}
	
}
