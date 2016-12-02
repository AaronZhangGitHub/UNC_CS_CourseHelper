import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CourseModel } from '../models/course.model';
import { SemesterModel } from '../models/semester.model';
import { UserModel } from '../models/user.model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  private _user: ReplaySubject<UserModel>;

  private semesters: SemesterModel[] = [ new SemesterModel("Semester 1") ];
  
  constructor(private http: Http) {
    let uid = 1; // TEST USER ID
    
    this._user = new ReplaySubject(1);
    this.http.get(`/api/User/${uid}`).map(this.extractData).subscribe(
      (user: UserModel) => this._user.next(user),
      (err: any) => alert(err)
    );
  }
  
  private extractData(res: Response) {
    return res.json() || { };
  }
  
  getUser(): Promise<UserModel> {
    return this._user.toPromise();
  }
  
  getCourseSemesters(): SemesterModel[] {
    return this.semesters;
  }
  
  postCourseSemesters(semester: SemesterModel[]) {
    this.semesters = semester;
    // TODO persist to server
  }
}