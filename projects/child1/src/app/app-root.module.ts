/**
 * We do not expose the root module
 * rather we expose this module for the remote
 *
 * Created May 12th, 2021
 * @author: ywarezk
 * @version: 0.0.1
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { AppRootRoutingModule } from './app-root-routing.module';

 @NgModule({
    declarations: [
      HomeComponent
    ],
    imports: [
      CommonModule,
      AppRootRoutingModule
    ],
    exports: [],
    providers: [],
 })
 export class AppRootModule {}
