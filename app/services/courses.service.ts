import { BubbleModel } from '../models/bubble.model';

export class CoursesService {
	private bubblesByCategory: { [id: string] : BubbleModel[] } = {};
	
	constructor() {
		this.addBubble(new BubbleModel("first_level", "COMP 401", "Introduction to CS"));
		
		this.addBubble(new BubbleModel("second_level", "COMP 410", "Data Structures"));
		this.addBubble(new BubbleModel("second_level", "COMP 411", "Computer Organization"));
	}
	
	private addBubble(b: BubbleModel) {
		var categ = this.bubblesByCategory[b.category];
		if (!categ) {
			this.bubblesByCategory[b.category] = [ b ];
		} else {
			categ.push(b);
		}
	}
	
	getBubblesAsMatrix() {
		var res: BubbleModel[][] = [ ];
		for (let key in this.bubblesByCategory) {
			let categ = this.bubblesByCategory[key];
			res.push(categ);
		}
	
		return res;
	}
}