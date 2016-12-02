import { UserService } from '../services/user.service';

/// Static class that contains what was returned from the server, to modify use course service
export class CourseModel {
  static readonly CAT_COLORS: string[] = [
    "red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green",
    "light-green", "lime", "yellow", "amber", "orange", "deep-orange", "blue-grey", "brown"
  ];

	constructor(public readonly CID: number,
        public readonly category: string, 
        public readonly alt_cat: string,
				public readonly code: string, 
				public readonly desc: string = "", 
        public readonly long_desc: string = "",
				public readonly eqcodes: number[] = [],
				public readonly prereq_eqcodes: number[] = [])
	{
		if (code.length < 8) throw "Invalid code: ${code}!";
    else if (CID == null) throw "Must provide the course's CID!";
    else if (category == null || alt_cat == null) throw "Course categories are required!";
    else if (eqcodes.length == 0) throw `Must provide at least one equivalence group for ${code}`;
	}
  
  /// Utility function to consistently convert a string to a color
  private strToColor(s: string): string {
    let code = s.split("").reduce(function(a,b){a=(a*31)+b.charCodeAt(0);return a|0},0); 
    code = Math.abs(code) % CourseModel.CAT_COLORS.length;
    return CourseModel.CAT_COLORS[code];
  }
  
  get categoryColor(): string {
    return this.strToColor(this.category);
  }
  
  get altCategoryColor() {
    return this.strToColor(this.alt_cat);
  }
	
}