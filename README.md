# Main Component Tree

```
Atlas
   Map
      Interface
      Minimap
   Community
      UserInfoCard
      Comments
      ToDo: Posts
   Nexus
      IMFData

      // Todo
      Class Structure
         Industrialists
         Finance Capitalists
         Landowners
         Intelligentsia
         Bourgeoise
         Proletariat
         Armed Forces
      Economy
         Industrial Centers
         Commodities
         Energy
         Ports
         etc.
      Trade
         Imports
         Exports
      Information
         Media Landscape
         Think Tanks
         Diplomats
      Dipolomacy
         Embassies, Consulates
         Ambassadors
      Military
         Bases
         Forces
```

# Atlas Visual Language

## Colors

Primary [Purple]
Secondary [Pink]
Tertiary [Yellow]

_Attention_ [Secondary]: Select an _option_ [Primary] to reveal _selected information_ [Tertiary].

## Sizes

ϕ

# Vite Info

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

js
parserOptions: {
ecmaVersion: 'latest',
sourceType: 'module',
project: ['./tsconfig.json', './tsconfig.node.json'],
tsconfigRootDir: \_\_dirname,
},

```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
```
