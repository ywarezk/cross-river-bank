import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () => import('./app-root.module').then(m => m.AppRootModule)
      }
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [],
})
export class AppRoutingModule {}
