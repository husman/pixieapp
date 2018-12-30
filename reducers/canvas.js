/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import {
  SET_CANVAS_TOOL,
} from 'actions/actionTypes';
import {
  Tools,
} from 'react-sketch';

/**
 * The initial state for the canvas.
 *
 * @type {{}}
 */
const initialState = {
  tool: Tools.Pencil,
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
    default:
      return state;
  }
}
