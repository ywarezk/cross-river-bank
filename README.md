# Micro Frontends Angular

How to create a micro frontend workspace using angular 11.

## 1. Create a new workspace

```bash
> npx @angular/cli new cross-river-bank3 --create-application=false --package-manager=yarn
```

## 2. Update webpack

**package.json**

```
"resolutions": {
  "webpack": "^5.0.0"
}
```

Install webpack5

```bash
> yarn
```

## 3. Create the projects

```bash
> npx ng g application parent
> npx ng g application child1
```

## 4. Install @angular-architects/module-federation

```bash
> npx ng add @angular-architects/module-federation --project parent --port 3000
> npx ng add @angular-architects/module-federation --project child1 --port 3001
``` 

## 5. child1 should expose the AppModule

***webpack.config.js*

```js

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "child1"
  },
  optimization: {
    // Only needed to bypass a temporary bug
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({

        // For remotes (please adjust)
        name: "child1",
        filename: "remoteEntry.js",
        exposes: {
            './AppModule': './projects/child1/src/app/app.module.ts',
        },

        shared: {
          "@angular/core": { singleton: true, strictVersion: true },
          "@angular/common": { singleton: true, strictVersion: true },
          "@angular/router": { singleton: true, strictVersion: true },

          ...sharedMappings.getDescriptors()
        }

    }),
    sharedMappings.getPlugin(),
  ],
};

```

## 6. parent should set the remote to the child

**webpack.config.js**

```js

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "parent"
  },
  optimization: {
    // Only needed to bypass a temporary bug
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
        // For hosts (please adjust)
        remotes: {
            "child1": "child1@http://localhost:3001/remoteEntry.js",
        },

        shared: {
          "@angular/core": { singleton: true, strictVersion: true },
          "@angular/common": { singleton: true, strictVersion: true },
          "@angular/router": { singleton: true, strictVersion: true },

          ...sharedMappings.getDescriptors()
        }

    }),
    sharedMappings.getPlugin(),
  ],
};


```

## 7. Add routing to the parent

**app-routing.module.ts**

```typescript
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      }
    ])
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}

```

**home.component.ts**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <h1>Homepage</h1>
  `,
})
export class HomeComponent  {
}

```

**app.module.ts**

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

## 8. Load the remote module from child in parent

**app-routing.module.ts**

```typescript
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

```

**app.component.ts**

```typescript

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


```


## 9. Added routing to the child

The child will not expose the **AppModule** rather it will create a child module of the **AppModule** for the entire app.  
We do this so we can add the **RouterModule.forRoot** in the **AppModule** and for child in the child module.  
We expose to the parent not the **AppModule** but the child.

**child1 - AppModule**

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

**child1 - app-routing.module.ts**

```typescript
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

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

```

**child1 - app-root.module.ts**

```typescript
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

```

**child1 - app-root-routing.module.ts**

```typescript
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

```

**child1 - app.component.ts**

```typescript
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

```

## 10. The parent needs to load the AppRootModule

**child1 - webpack.config.js**

set the exposed module to be the AppRootModule

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "child1"
  },
  optimization: {
    // Only needed to bypass a temporary bug
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({

        // For remotes (please adjust)
        name: "child1",
        filename: "remoteEntry.js",
        exposes: {
            './AppRootModule': './projects/child1/src/app/app-root.module.ts',
        },

        shared: {
          "@angular/core": { singleton: true, strictVersion: true },
          "@angular/common": { singleton: true, strictVersion: true },
          "@angular/router": { singleton: true, strictVersion: true },

          ...sharedMappings.getDescriptors()
        }

    }),
    sharedMappings.getPlugin(),
  ],
};

```

**parent - app-routing.module.ts**

```typescript

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
            exposedModule: './AppRootModule',
            remoteName: 'child1',
            remoteEntry: 'http://localhost:3001/remoteEntry.js'
          });
          return module.AppRootModule;
        }
      }
    ])
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}


```

## 11. Sharing data between parent and child using ngrx

Add @ngrx/store to the parent and @ngrx/store-devtools to the parent

```bash
> cd projects/parent/src/app
> npx ng add @ngrx/store@latest
> npx ng add @ngrx/store-devtools@latest
```

Add @ngrx/store to the child and @ngrx/store-devtools to the child

```bash
> cd projects/child1/src/app
> npx ng add @ngrx/store@latest
> npx ng add @ngrx/store-devtools@latest
```

Notice that for the child those models will be included in the **AppModule** which is not exposed to the parent which is using **AppRootModule**  


Add **@ngrx/store** to the webpack.config.js of the parent and child1

```
shared: {
  "@angular/core": { singleton: true, strictVersion: true },
  "@angular/common": { singleton: true, strictVersion: true },
  "@angular/router": { singleton: true, strictVersion: true },
  "@ngrx/store": { singleton: true, strictVersion: true },

  ...sharedMappings.getDescriptors()
}
```

## 12. Library for shared data

It's more appropriate to place the shared data in a library.

```bash
> npx ng g library @river/auth
```

In that library delete all the lib folder and place these files:

**auth.module.ts**

```typescript
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

```

**auth.actions.ts**

```typescript
import { createAction, props } from '@ngrx/store';

export const setFirstName = createAction(
  '[auth] setFirstName',
  props<{firstName: string}>()
)

```

**auth.reducer.ts**

```
import { createReducer, on } from '@ngrx/store';
import { setFirstName } from './auth.actions';

export const userReducer = createReducer(
  {
    firstName: 'Yariv',
    lastName: 'Katz'
  },
  on(setFirstName, (state, action) => ({...state, firstName: action.firstName}))
)

```

## 13. we need to the federation about this library

Modify the **webpack.config.js** of the parent and child1

```js
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  ['@river/auth']);
```

## 14. parent and child1 are sharing redux data

we can now access the data in the child1 and change the data in the parent and child1 will be updated.

In the parent **app.component.ts** add this to change the data

```typescript
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

```

In this child1 **home.component.ts** add this to read the data

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

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

```
