import { UserService } from '../services/user.service';

export interface IBubble {
	getTitle(): string;
	getText(): string;
	show(userService: UserService): boolean;
}