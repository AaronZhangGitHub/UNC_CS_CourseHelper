import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoursesService } from './services/courses.service';

import { AppComponent }  from './app.component';
import { BubbleComponent } from './components/bubble.component';
import { BubbleContainerComponent } from './components/bubblecontainer.component';

@NgModule({
  imports: [ BrowserModule ],
  providers: [
	CoursesService
  ],
  declarations: [ 
	AppComponent,
	BubbleComponent,
	BubbleContainerComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
