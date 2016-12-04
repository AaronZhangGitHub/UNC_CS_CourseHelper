import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { CoursePopupComponent } from './components/coursepopup.component';
import { CourseModel } from './models/course.model';
import { UserModel } from './models/user.model';
import { CoursesService } from './services/courses.service';
import { UserService } from './services/user.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'my-app',
  template: `
  <nav class="blue lighten-1" *ngIf="logged_in">
    <div class="nav-wrapper row">
      <div class="col l11 s10" style="height: 100%">
        <div class="input-field">
          <input [(ngModel)]="txt_search" type="search" (keyup)="search()">
          <label for="search"><i class="material-icons">search</i></label>
          <i class="material-icons" (click)="clearSearch()">close</i>
        </div>
      </div>
      <div class="col l1 s2" style="height: 100%">
        <a href="javascript:;" (click)="logout()"><i class="fa fa-fw fa-sign-out fa-3"></i></a>
      </div>
    </div>
  </nav>
  
  <ul class="dropdown-content" [class.active]="(search_res | async)?.length > 0" (click)="clearSearch()">
    <li *ngFor="let course of search_res | async" (click)="showDetails(course)">
      <a href="javascript:;">{{ course.code }} - Details</a>
    </li>
  </ul>
  
  <router-outlet (activate)="onActivate($event, outlet)" #outlet></router-outlet>
  
  <div #popupAnchor></div>
  `
})
export class AppComponent implements OnInit {
  
  // Dynamic popup view
  @ViewChild('popupAnchor', {read: ViewContainerRef}) popupAnchor: ViewContainerRef;
  
  private logged_in: boolean;
  private txt_search: string;
  private search_res: Observable<CourseModel[]>;
  
  constructor(private courseService: CoursesService, private userService: UserService, private componentFactoryResolver: ComponentFactoryResolver) { 
    this.logged_in = false;
    
    userService.getUserAsObservable().subscribe((user: UserModel) => {
      this.logged_in = (user != null);
    });
  }

  ngOnInit() {
    // Global handler for when someone requests a course popup
    this.courseService.courseDetailsPopupReq.subscribe((c: CourseModel) => {
      // Close any already open dialogs
      this.popupAnchor.clear();
      
      // Create component
      let popupComponentFactory = this.componentFactoryResolver.resolveComponentFactory(CoursePopupComponent);
      let popupComponentRef = this.popupAnchor.createComponent(popupComponentFactory);
      
      // Bind inputs and outputs
      popupComponentRef.instance.setCourse(c);
      popupComponentRef.instance.close.subscribe(() => {
        popupComponentRef.destroy();
      });
    });
  }
  
  logout() {
    this.userService.logout();
  }
  
  search() {
    this.search_res = this.courseService.findCourses(this.txt_search);
  }
  
  clearSearch() {
    this.txt_search = "";
    this.search_res = null;
  }
  
  private showDetails(course: CourseModel) {
    // Request for the master page to show the details popup for this course
    this.courseService.requestDetailsPopup(course);
  }
  
  onActivate(e: any, outlet: any) {
    outlet.scrollTop = 0;
  }
}