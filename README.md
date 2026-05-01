# vue-project

Frontend for event registration system. Admins create events; users (no login required) browse them and register with their personal details. Built with Vue 3, TypeScript, Pinia, Vue Router, Bootstrap, and Vite.

## Public URL

- Backend public URL: misauk-netgroup-back.proxy.itcollege.ee (MVC, used for quick testing)
- Backend repository URL: github.com/Scarymixo/netgroup-project
- Frontend public URL: misauk-netgroup.proxy.itcollege.ee (Vue, separate repo)
- Frontend repository URL: https://github.com/Scarymixo/netgroup-project-front

## Tech Stack

- **Vue 3** + **TypeScript** (Composition API)
- **Vite** for dev server and bundling
- **Pinia** for state management
- **Vue Router** for client-side routing
- **Axios** for HTTP
- **Bootstrap 5** for styling
- **Vitest** + **@vue/test-utils** for unit tests
- **ESLint** (oxlint + eslint) and **Prettier**

## Project Structure

```
src/
├── App.vue
├── main.ts
├── components/        # Reusable UI components
├── domain/            # Domain types/models
├── router/            # Vue Router setup (index.ts)
├── services/          # API clients (Auth, Event, Participant, httpClient)
├── stores/            # Pinia stores (authStore)
├── views/             # Route-level pages (Main, Login, About, NotFound)
└── __tests__/         # Unit tests
```

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm

## Getting Started

```sh
cd vue-project
npm install
npm install axios
npm run dev
```

The dev server starts with hot-reload at the URL printed by Vite (typically http://localhost:5173).

To run locally, backend must be running in another project.

## Scripts

| Script              | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Start Vite dev server with HMR                         |
| `npm run build`     | Type-check and build for production                    |
| `npm run preview`   | Preview the production build locally                   |
| `npm run test:unit` | Run unit tests with Vitest                             |
| `npm run type-check`| Run `vue-tsc` type checking                            |
| `npm run lint`      | Run oxlint + eslint with autofix                       |
| `npm run format`    | Format `src/` with Prettier                            |

## Configuration

API base URL and other environment settings are read from Vite env files (`.env`, `.env.local`, etc.). See [Vite env vars](https://vite.dev/guide/env-and-mode.html) and [Vite Configuration Reference](https://vite.dev/config/). Might need to create a new .env file locally.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium (Chrome, Edge, Brave):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Enable Custom Object Formatters](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Enable Custom Object Formatters](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Testing

```sh
npm run test:unit
```

Tests live alongside `src/` under `src/__tests__/` and use Vitest with jsdom.

## Building for Production

```sh
npm run build
npm run preview
```

The build output is emitted to `dist/`.

## Git setup

For deployment a private repo is being used, github is a public mirror of this repo. This choice was made to demonstrate the knowledge of deployment.
