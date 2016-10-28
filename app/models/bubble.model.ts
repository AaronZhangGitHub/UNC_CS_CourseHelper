export class BubbleModel {

	constructor(public readonly category: string, public readonly code: string, public readonly desc: string) {
		if (code.length < 8) throw "Invalid code: ${code}!";
	}
	
	hasPrereqs(user: any): boolean {
		return true;
	}
	
}