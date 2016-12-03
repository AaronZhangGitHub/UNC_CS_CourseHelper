import { NgModule }    from '@angular/core';
import { HttpModule }  from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule, DragulaService } from '../node_modules/ng2-dragula/ng2-dragula.js';
import { CookieService } from '../node_modules/angular2-cookie/services/cookies.service';

import { UserService } from './services/user.service';
import { CoursesService } from './services/courses.service';

import { AppComponent }  from './app.component';
import { HomeComponent } from './components/home.component';
import { LoginComponent } from './components/login.component';
import { CourseComponent } from './components/course.component';
import { WelcomeComponent } from './components/welcome.component';
import { SemesterComponent } from './components/semester.component';
import { CourseChipComponent } from './components/coursechip.component';
import { CoursePopupComponent } from './components/coursepopup.component';
import { TakenCoursesComponent } from './components/takencourses.component';
import { TopNotificationComponent } from './components/topnotification.component';
import { CoursesContainerComponent } from './components/coursescontainer.component';
import { SemesterCategorizerComponent } from './components/semestercategorizer.component';

import { CoursePlannerComponent } from './components/home/courseplanner.component';
import { SemesterPlannerComponent } from './components/home/semesterplanner.component';
import { FormComponent} from './components/form.component';

const appRoutes: Routes = [
  { path: 'semester', component: SemesterComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [ 
    BrowserModule,
    DragulaModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [
    UserService,
    CoursesService,
    DragulaService,
    CookieService
  ],
  declarations: [ 
    AppComponent,
    HomeComponent,
    LoginComponent,
    CourseComponent,
    WelcomeComponent,
    SemesterComponent,
    CourseChipComponent,
    CoursePopupComponent,
    TakenCoursesComponent,
    TopNotificationComponent,
    CoursesContainerComponent,
    SemesterCategorizerComponent,
    
    CoursePlannerComponent,
    SemesterPlannerComponent,
    FormComponent
  ],
  entryComponents: [ CoursePopupComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
