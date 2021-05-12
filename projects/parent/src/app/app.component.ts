import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>
      Hello parent app
    </h1>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
}
