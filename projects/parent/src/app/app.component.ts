import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>
      Hello parent app
    </h1>

    <a routerLink="/">home</a>
    <a routerLink="/child">child</a>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
}
