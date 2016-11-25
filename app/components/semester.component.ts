import { Component } from '@angular/core';

// The second page the user sees after the welcome page
@Component({
  selector: 'semester',
  template: `
    <topnotification text="Optionally categorize the courses you've taken by semester"></topnotification>
    
    <semestercategorizer></semestercategorizer>
    
    <div class="fixed-action-btn">
      <a routerLink="/home" routerLinkActive="active" class="btn-floating btn-large">
        <i class="large material-icons">done</i>
      </a>
      <ul>
        <li><a routerLink="/welcome" routerLinkActive="active" class="btn-floating red"><i class="fa fa-arrow-left"></i></a></li>
      </ul>
    </div>
  `
})
export class SemesterComponent { }
