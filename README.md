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

