import { Component, ComponentFactoryResolver, Input, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { CoursePopupComponent } from './coursepopup.component';
import { CourseModel } from '../models/course.model';

@Component({
    selector: 'course',
    template: `
	<div class="col s12 m6 l4">
		<div class="click-card card">
			<div class="card-content darken-2 white-text" [ngClass]="model.getCatColor()" (click)="onClick()">
        <span class="badge white-text darken-3" [ngClass]="model.getAltCatColor()">{{ model.alt_cat }}</span>
				<span class="card-title">
          {{model.code}}
        </span>
				<p>{{model.desc}}</p>
			</div>
      <div class="card-action">
        <a href="javascript:void(0)" (click)="showDetails()">Details</a>
      </div>
		</div>
	</div>
  
  <div #popupAnchor></div>`
})
export class CourseComponent {
  // Dynamic popup view
  @ViewChild('popupAnchor', {read: ViewContainerRef}) popupAnchor: ViewContainerRef;

	@Input()
	model: CourseModel;
	
	@Output()
	clicked = new EventEmitter<CourseModel>();
  
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
	
	private onClick() {		
		this.clicked.emit(this.model);
	}
  
  private showDetails() {
    // Close any already open dialogs
    this.popupAnchor.clear();
    
    // Create component
    let popupComponentFactory = this.componentFactoryResolver.resolveComponentFactory(CoursePopupComponent);
    let popupComponentRef = this.popupAnchor.createComponent(popupComponentFactory);
    
    // Bind inputs and outputs
    popupComponentRef.instance.course = this.model;
    popupComponentRef.instance.close.subscribe(() => {
      popupComponentRef.destroy();
    });
  }
}
