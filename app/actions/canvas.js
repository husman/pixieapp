/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import {
  CANVAS_UPLOAD_COMPLETE,
  CANVAS_UPLOAD_START,
  SET_CANVAS_TOOL,
} from './actionTypes';

/**
 * Updates the canvas' tool to the specified value.
 *
 * @param {Number} tool - The tool to activate.
 * @return {{}} - Action
 */
export function setCanvasTool(tool) {
  return {
    type: SET_CANVAS_TOOL,
    tool,
  };
}

/**
 * Dispatched when a user uploads a file onto the canvas.
 *
 * @param {{}} file - The data of the file uploaded.
 * @return {{}} - Action
 */
export function canvasUploadComplete(file) {
  return {
    type: CANVAS_UPLOAD_COMPLETE,
    file,
  };
}

/**
 * Dispatched when a user uploads a file onto the canvas.
 *
 * @param {{}} file - The data of the file uploaded.
 * @return {{}} - Action
 */
export function canvasUploadStart(file) {
  return {
    type: CANVAS_UPLOAD_START,
    file,
  };
}
