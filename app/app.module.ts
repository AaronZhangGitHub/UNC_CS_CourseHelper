import { NgModule }      from '@angular/core';
import { HttpModule }    from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule } from '../node_modules/ng2-dragula/ng2-dragula.js';

import { UserService } from './services/user.service';
import { CoursesService } from './services/courses.service';

import { AppComponent }  from './app.component';
import { CourseComponent } from './components/course.component';
import { WelcomeComponent } from './components/welcome.component';
import { SemesterComponent } from './components/semester.component';
import { TakenCoursesComponent } from './components/takencourses.component';
import { TopNotificationComponent } from './components/topnotification.component';
import { CoursesContainerComponent } from './components/coursescontainer.component';

@NgModule({
  imports: [ 
    BrowserModule,
    DragulaModule,
    HttpModule
  ],
  providers: [
    UserService,
    CoursesService
  ],
  declarations: [ 
    AppComponent,
    CourseComponent,
    WelcomeComponent,
    SemesterComponent,
    TakenCoursesComponent,
    TopNotificationComponent,
    CoursesContainerComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
