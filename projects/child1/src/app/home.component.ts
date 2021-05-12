import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-home',
  template: `
    <h1>
      Child homepage {{ (user$ | async).firstName }} {{ (user$ | async).lastName }}
    </h1>
  `,
})
export class HomeComponent {
  user$ = this._store.select((state: any) => state.auth.user)

  constructor(private _store: Store) {}
}
