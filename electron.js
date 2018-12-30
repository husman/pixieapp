/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */
/* eslint-disable no-console */

import {
  app,
  BrowserWindow,
} from 'electron';

import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  installExtension(REDUX_DEVTOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));

  mainWindow = new BrowserWindow();
  mainWindow.loadURL('file:///Users/haleeq/workspace/neetos-vc/pixieapp/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
