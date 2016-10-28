export class BubbleModel {

	constructor(public code: string, public desc: string) {
		if (code.length < 8) throw "Invalid code: ${code}!";
	}
	
	hasPrereqs(user: any): boolean {
		return true;
	}
	
}