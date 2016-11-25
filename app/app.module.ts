import { NgModule }      from '@angular/core';
import { HttpModule }    from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule, DragulaService } from '../node_modules/ng2-dragula/ng2-dragula.js';

import { UserService } from './services/user.service';
import { CoursesService } from './services/courses.service';

import { AppComponent }  from './app.component';
import { LoginComponent } from './components/login.component';
import { CourseComponent } from './components/course.component';
import { WelcomeComponent } from './components/welcome.component';
import { SemesterComponent } from './components/semester.component';
import { CourseChipComponent } from './components/coursechip.component';
import { CoursePopupComponent } from './components/coursepopup.component';
import { TakenCoursesComponent } from './components/takencourses.component';
import { TopNotificationComponent } from './components/topnotification.component';
import { CoursesContainerComponent } from './components/coursescontainer.component';


const appRoutes: Routes = [
  { path: 'semester', component: SemesterComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [ 
    BrowserModule,
    DragulaModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    UserService,
    CoursesService,
    DragulaService
  ],
  declarations: [ 
    AppComponent,
    LoginComponent,
    CourseComponent,
    WelcomeComponent,
    SemesterComponent,
    CourseChipComponent,
    CoursePopupComponent,
    TakenCoursesComponent,
    TopNotificationComponent,
    CoursesContainerComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
