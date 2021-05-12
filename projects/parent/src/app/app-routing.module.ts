import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'child',
        loadChildren: async () => {
          const module = await loadRemoteModule({
            exposedModule: './AppModule',
            remoteName: 'child1',
            remoteEntry: 'http://localhost:3001/remoteEntry.js'
          });
          return module.AppModule;
        }
      }
    ])
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
