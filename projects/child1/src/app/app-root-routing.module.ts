import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [],
})
export class AppRootRoutingModule {}
