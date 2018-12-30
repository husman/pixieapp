/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import {
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
  }
}
