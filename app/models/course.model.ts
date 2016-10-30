import { UserService } from '../services/user.service';

export class CourseModel {

	constructor(public readonly category: string, 
				public readonly code: string, 
				public readonly desc: string, 
				public readonly equivalence_groups: string[],
				public readonly prereq_codes: string[]) 
	{
		if (code.length < 8) throw "Invalid code: ${code}!";
	}
	
	isShowing(userService: UserService) {
		return (!userService.hasTaken(this.code) && this.hasPrereqs(userService));
	}
	
	private hasPrereqs(userService: UserService) {
		for (let pr_code of this.prereq_codes) {
			if (!userService.hasEquivalent(pr_code)) return false;
		}
	
		return true;
	}
	
}