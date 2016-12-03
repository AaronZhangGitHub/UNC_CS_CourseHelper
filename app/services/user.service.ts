import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CourseModel } from '../models/course.model';
import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';

@Injectable()
export class UserService {
  private _user: BehaviorSubject<UserModel>;
  
  constructor(private http: Http) {
    let uid = 1; // TEST USER ID
    
    this._user = new BehaviorSubject<UserModel>(null);
    this.http.get(`/api/User/${uid}`).map(this.extractData).subscribe(
      (users: UserModel[]) => this._user.next(users[0]),
      (err: any) => alert(err)
    );
  }
  
  private extractData(res: Response) {
    return res.json() || { };
  }
  
  getUser(): Observable<UserModel> {
    return this._user.asObservable().filter((user: UserModel) => user != null).take(1);
  }
}