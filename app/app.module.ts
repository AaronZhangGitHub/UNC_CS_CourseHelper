import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { UserService } from './services/user.service';
import { CoursesService } from './services/courses.service';

import { AppComponent }  from './app.component';
import { CourseComponent } from './components/course.component';
import { TakenCoursesComponent } from './components/takencourses.component';
import { CoursesContainerComponent } from './components/coursescontainer.component';

@NgModule({
  imports: [ BrowserModule ],
  providers: [
	UserService,
	CoursesService
  ],
  declarations: [ 
	AppComponent,
	CourseComponent,
	TakenCoursesComponent,
	CoursesContainerComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
