/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import {
  OPEN_SCREEN_SHARE_DIALOG,
  CLOSE_SCREEN_SHARE_DIALOG,
  START_SCREEN_SHARING,
  STOP_SCREEN_SHARING,
} from '../actions/video';
import { USER_SIGN_OUT } from '../actions/user';

/**
 * The initial state for the canvas.
 *
 * @type {{}}
 */
const initialState = {};

/**
 * The main reducer for the the app views.
 *
 * @param {{}} state - The current state for the app views.
 * @param {{}} action - The action's parameters.
 *
 * @return {{}} - new state
 */
export default function screenShare(state = initialState, action) {
  switch (action.type) {
    case OPEN_SCREEN_SHARE_DIALOG:
      return {
        ...state,
        isScreenShareDialogOpened: true,
        screenShareSources: action.sources,
      };
    case CLOSE_SCREEN_SHARE_DIALOG:
      return {
        ...state,
        isScreenShareDialogOpened: false,
      };
    case START_SCREEN_SHARING:
      return {
        ...state,
        isScreenShareDialogOpened: false,
        sourceId: action.sourceId,
      };
    case STOP_SCREEN_SHARING:
      return {
        ...state,
        isScreenShareDialogOpened: false,
        stream: null,
      };
    case USER_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
}
