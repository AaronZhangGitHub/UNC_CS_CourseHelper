import { NgModule }      from '@angular/core';
import { HttpModule }    from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { UserService } from './services/user.service';
import { CoursesService } from './services/courses.service';

import { AppComponent }  from './app.component';
import { CourseComponent } from './components/course.component';
import { WelcomeComponent } from './components/welcome.component';
import { TakenCoursesComponent } from './components/takencourses.component';
import { CoursesContainerComponent } from './components/coursescontainer.component';

@NgModule({
  imports: [ 
    BrowserModule,
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
    TakenCoursesComponent,
    CoursesContainerComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
