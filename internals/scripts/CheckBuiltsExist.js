/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

// Check if the renderer and main bundles are built
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

function CheckBuildsExist() {
  const mainPath = path.join(__dirname, '..', '..', 'app', 'main.prod.js');
  const rendererPath = path.join(
    __dirname,
    '..',
    '..',
    'app',
    'dist',
    'renderer.prod.js',
  );

  if (!fs.existsSync(mainPath)) {
    const message = 'The main process is not built yet. Build it by running "yarn build-main"';

    throw new Error(chalk.whiteBright.bgRed.bold(message));
  }

  if (!fs.existsSync(rendererPath)) {
    const message = 'The renderer process is not built yet. Build it by running "yarn build-renderer"';

    throw new Error(chalk.whiteBright.bgRed.bold(message));
  }
}

CheckBuildsExist();
