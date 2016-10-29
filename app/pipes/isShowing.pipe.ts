import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user.service';
import { CourseModel } from '../models/course.model';

@Pipe({name: 'isShowing'})
export class IsShowingPipe implements PipeTransform {

	constructor(private userService: UserService) { }

	transform(value: CourseModel[]): CourseModel[] {
		return value.filter(v => v.isShowing(this.userService));
	}
}