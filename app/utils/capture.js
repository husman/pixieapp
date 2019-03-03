/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import {
  desktopCapturer,
  screen,
  remote as screenRemote,
} from 'electron';

/**
 * Alias for the 'full screen' capture source.
 *
 * @type {string}
 */
const CAPTURE_SOURCE_SCREEN_1 = 'Screen 1';
const CAPTURE_SOURCE_ENTIRE_SCREEN = 'Entire screen';

/**
 * Provides a list of possible capture source aliases.
 *
 * @type {Set<String>}
 */
const POSSIBLE_CAPTURE_SOURCES = new Set([
  CAPTURE_SOURCE_ENTIRE_SCREEN,
  CAPTURE_SOURCE_SCREEN_1,
]);

/**
 * Provides a list of capture sources or an error if the operation was unsuccessful.
 *
 * @returns {Promise} - A promise that resolves to an array of capture sources or an error.
 */
export async function getSources() {
  return new Promise((resolve, reject) => {
    const options = {
      types: [
        'screen',
      ],
    };
    const getSourcesCallback = (error, sources) => (error ? reject(error) : resolve(sources));

    desktopCapturer.getSources(options, getSourcesCallback);
  });
}

/**
 * Fetches the primary capture source ID.
 *
 * @returns {String} - A promise that resolves with the source ID or undefined.
 */
export async function getCaptureSourceId() {
  let sourceId = '';

  try {
    const sources = await getSources();
    const source = sources.find(({ name }) => POSSIBLE_CAPTURE_SOURCES.has(name));

    sourceId = source && source.id;
  } catch (err) {
    console.error('An error occurred while fetching the capture source ID', err); // eslint-disable-line no-console
  }

  return sourceId;
}

/**
 * Provides the primary screen's dimensions.
 *
 * @returns {Electron.Size} - screen dimensions.
 */
export function getScreenSize() {
  return screen.getPrimaryDisplay().size;
}

export function captureScreen(rect) {
  return new Promise((resolve) => {
    screenRemote.getCurrentWindow().capturePage(rect, resolve);
  });
}
