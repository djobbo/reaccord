# Using Typescript

## Installation

Reaccord has typescript support built-in, but for the optimal experience you might want to add `@types/react` to your devDependencies.


```bash:no-line-numbers
npm install -D @types/react
yarn add -D @types/react
pnpm add -D @types/react
```

## Getting the right jsx types

In order to get a complete typescript experience you'll want to add these two rules to your `tsconfig.json`

```json
{
    "compilerOptions": {
        ...
        "jsx": "react-jsx",
        "jsxImportSource": "reaccord"
        ...
    }
}
```