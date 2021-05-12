import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './auth.reducer';

@NgModule({
  declarations: [

  ],
  imports: [
    StoreModule.forFeature('auth', {
      user: userReducer
    })
  ],
  exports: [
  ]
})
export class AuthModule { }
