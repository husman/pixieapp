/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

/* eslint global-require: off */
/* eslint no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 */
import {
  app,
  ipcMain,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import windowManager from 'electron-window-manager';
import log from 'electron-log';
import { createStore, applyMiddleware } from 'redux';
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import urlParse from 'url-parse';
import reducers from './reducers';
import {
  appUpdateDownloaded,
} from './actions/app';
import { setUserInfo } from './actions/user';

// Redux
const store = createStore(
  reducers,
  applyMiddleware(
    triggerAlias, // optional, see below
    forwardToRenderer, // IMPORTANT! This goes last
  ),
);

replayActionMain(store);

export function initAppUpdater() {
  log.transports.file.level = 'info';
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-downloaded', () => {
    store.dispatch(appUpdateDownloaded());
  });

  ipcMain.on('quit-and-install', () => {
    autoUpdater.quitAndInstall();
  });
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

/**
 * Installs development extensions.
 *
 * @return {Promise}
 */
const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(log.info);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    await installExtensions();
  }

  if (process.platform === 'win32' && process.argv.slice(1)) {

    const {
      query: {
        id: meetingId,
        name: firstName,
      },
    } = urlParse(process.argv.slice(1), true);

    store.dispatch(
      setUserInfo({
        meetingId,
        firstName,
      }),
    );
  }

  const mainWindow = windowManager.createNew(
    'main',
    'Pixie Canvas',
    `file://${__dirname}/app.html`,
    false,
    {
      show: true,
      resizable: true,
      width: 865,
      height: 700,
    },
  )
    .create();

  mainWindow.object.on('closed', () => {
    windowManager.closeAll();
  });

  windowManager.createNew(
    'presenter-toolbar',
    false,
    `file://${__dirname}/presenterToolbar.html`,
    false,
    {
      frame: false,
      show: false,
      width: 370,
      height: 65,
    },
  )
    .create();

  const winFullscreenBorderOverlay = windowManager.createNew(
    'presenter-overlay',
    false,
    `file://${__dirname}/presenterOverlay.html`,
    false,
    {
      frame: false,
      focusable: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: true,
      show: false,
    },
  );
  winFullscreenBorderOverlay.create();

  winFullscreenBorderOverlay.onReady(true, () => {
    winFullscreenBorderOverlay.maximize();
    winFullscreenBorderOverlay.object.setIgnoreMouseEvents(true);
  });

  initAppUpdater();
});

app.on('open-url', (event, url) => {
  const {
    query: {
      id: meetingId,
      name: firstName,
    },
  } = urlParse(url, true);


  store.dispatch(
    setUserInfo({
      meetingId,
      firstName,
    }),
  );
});
