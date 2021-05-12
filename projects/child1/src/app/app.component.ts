import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>
      This is the child app
    </h1>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
}
