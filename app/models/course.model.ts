import { UserService } from '../services/user.service';
import { IBubble } from './IBubble';

export class CourseModel implements IBubble {

	constructor(public readonly category: string, 
				public readonly code: string, 
				public readonly desc: string, 
				public readonly prereq_codes: string[]) 
	{
		if (code.length < 8) throw "Invalid code: ${code}!";
	}
	
	// From IBubble
	getTitle(): string {
		return this.code;
	}
	
	// From IBubble
	getText(): string {
		return this.desc;
	}
	
	// From IBubble
	show(userService: UserService) {
		return !userService.hasTaken(this.code) && this.hasPrereqs(userService);
	}
	
	hasPrereqs(userService: UserService) {
		for (let pr_code of this.prereq_codes) {
			if (!userService.hasTaken(pr_code)) return false;
		}
	
		return true;
	}
	
}