export class UserTakenCourseModel {
  
  public readonly User: number;
  public readonly Class: number;
  public readonly Semester: string;
  
}

export class UserModel {

  public readonly UID: number;
	public readonly Name: string;
  public readonly Username: string;
  public readonly ClassesTaken: UserTakenCourseModel[];
  public readonly ClassesToTake: UserTakenCourseModel[];
  public readonly Interests: number[];  
	
}