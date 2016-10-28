import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { BubbleComponent } from './components/bubble.component';
import { BubbleContainerComponent } from './components/bubblecontainer.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ 
	AppComponent,
	BubbleComponent,
	BubbleContainerComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
