/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

// import { Tools } from 'react-sketch';
import {
  SET_CANVAS_TOOL,
  CANVAS_UPLOAD_COMPLETE,
  CANVAS_UPLOAD_START,
} from '../actions/actionTypes';

/**
 * The initial state for the canvas.
 *
 * @type {{}}
 */
const initialState = {
  // tool: Tools.Pencil,
  tool: null,
};

/**
 * The main reducer for the canvas.
 *
 * @param {{}} state - The current state for the canvas.
 * @param {{}} action - The action's parameters.
 *
 * @return {{}} - new state
 */
export default function canvas(state = initialState, action) {
  switch (action.type) {
    case SET_CANVAS_TOOL:
      return {
        ...state,
        tool: action.tool,
      };
    case CANVAS_UPLOAD_COMPLETE:
      return {
        ...state,
        isUploading: false,
        files: [
          ...(state.files || []),
          action.file,
        ],
      };
    case CANVAS_UPLOAD_START:
      return {
        ...state,
        isUploading: true,
      };
    default:
      return state;
  }
}
