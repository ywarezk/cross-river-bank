import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setFirstName } from '@river/auth';

@Component({
  selector: 'app-root',
  template: `
    <h1>
      Hello parent app
    </h1>
    <button (click)="changeName()">
      Click to change name
    </button>

    <a routerLink="/">home</a>
    <a routerLink="/child">child</a>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {

  constructor(private _store: Store) { }

  changeName() {
    this._store.dispatch(setFirstName({ firstName: Math.random().toString() }));
  }

}
