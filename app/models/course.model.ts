import { UserService } from '../services/user.service';

export class CourseModel {
  static readonly CAT_COLORS = [
    "red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green",
    "light-green", "lime", "yellow", "amber", "orange", "deep-orange", "blue-grey", "brown"
  ];

	constructor(public readonly cid: number,
        public readonly category: string, 
        public readonly alt_cat: string,
				public readonly code: string, 
				public readonly desc: string, 
        public readonly long_desc: string,
				public readonly equivalence_groups: number[],
				public readonly prereq_codes: number[]) 
	{
		if (code.length < 8) throw "Invalid code: ${code}!";
    else if (equivalence_groups.length == 0) throw "Must provide at least one equivalence group for ${code}";
	}
  
  private strToColor(s: string) {
    let code = s.split("").reduce(function(a,b){a=(a*31)+b.charCodeAt(0);return a|0},0); 
    code = Math.abs(code) % CourseModel.CAT_COLORS.length;
    return CourseModel.CAT_COLORS[code];
  }
  
  getCatColor() {
    return this.strToColor(this.category);
  }
  
  getAltCatColor() {
    return this.strToColor(this.alt_cat);
  }
  
  hasTaken(userService: UserService) {
    return userService.hasTaken(this.code);
  }
	
	isShowing(userService: UserService) {
		return (!this.hasTaken(userService) && this.hasPrereqs(userService));
	}
	
	private hasPrereqs(userService: UserService) {
    let pr_code: number;
		for (pr_code of this.prereq_codes) {
      if (pr_code == 0) continue;
    
			if (!userService.hasEquivalent(pr_code)) return false;
		}
	
		return true;
	}
	
}