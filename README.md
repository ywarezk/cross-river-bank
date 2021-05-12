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

