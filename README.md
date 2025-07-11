# Project Name

A brief description of your project here.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command         | Description                                    |
| --------------- | ---------------------------------------------- |
| `npm install`   | Install project dependencies                   |
| `npm run dev`   | Launch a development web server                |
| `npm run build` | Create a production build in the `dist` folder |

## Getting Started

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm run dev`.

The local development server runs on `http://localhost:8080` by default.

Once the server is running you can edit any of the files in the `src` folder. Vite will automatically recompile your code and then reload the browser.

## Project Structure

| Path               | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `index.html`       | A basic HTML page to contain the application.                   |
| `public/assets`    | Static assets, sprites, audio, etc. Served directly at runtime. |
| `public/style.css` | Global layout styles.                                           |
| `src/main.ts`      | Application bootstrap.                                          |
| `src/game`         | Folder containing the game code.                                |
| `src/game/main.ts` | Game entry point: configures and starts the game.               |
| `src/game/scenes`  | Folder with all game scenes.                                    |

## Handling Assets

Vite supports loading assets via JavaScript module `import` statements.

This template provides support for both embedding assets and also loading them from a static folder. To embed an asset, you can import it at the top of the JavaScript file you are using it in:

```js
import logoImg from "./assets/logo.png";
```

To load static files such as audio files, videos, etc place them into the `public/assets` folder. Then you can use this path in your code:

```js
// Example of loading a static image from the public/assets folder:
const background = "assets/bg.png";
```

When you issue the `npm run build` command, all static assets are automatically copied to the `dist/assets` folder.

## Deploying to Production

After you run the `npm run build` command, your code will be built into a single bundle and saved to the `dist` folder, along with any other assets your project imported, or stored in the public assets folder.

In order to deploy your application, you will need to upload _all_ of the contents of the `dist` folder to a public facing web server.

## Customizing the Build

If you want to customize your build, such as adding plugins (i.e. for loading CSS or fonts), you can modify the `vite/config.*.mjs` file for cross-project changes, or you can modify and/or create new configuration files and target them in specific npm tasks inside of `package.json`. Please see the [Vite documentation](https://vitejs.dev/) for more information.
