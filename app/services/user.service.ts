import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CookieService } from 'angular2-cookie/core';
import { CourseModel } from '../models/course.model';
import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';

@Injectable()
export class UserService {
  private _user: BehaviorSubject<UserModel>;
  
  constructor(public router: Router, private http: Http, private cookies: CookieService) {    
    this._user = new BehaviorSubject<UserModel>(null);
    
    // If has cookie, use that to get user
    if (cookies.get("auth")) {
      let uid = cookies.get("auth");
      this.http.get(`/api/User/${uid}`).map(this.extractData).subscribe(
        (users: UserModel[]) => this._user.next(users[0]),
        (err: any) => alert(err)
      );
    }
  }
  
  private extractData(res: Response) {
    return res.json() || { };
  }
  
  /// Get the user as observable that will emit every time the user changes
  getUserAsObservable(): Observable<UserModel> {
    return this._user.asObservable();
  }
  
  /// Get the current user (once) or wait for a user
  getUser(): Observable<UserModel> {
    return this.getUserAsObservable().filter((user: UserModel) => user != null).take(1);
  }

  logout() {
    this.cookies.remove("auth");
    this._user.next(null);
    this.router.navigateByUrl('/');
  }
  
  login(user: UserModel) {
    this._user.next(user);
  }
}
