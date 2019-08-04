/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import {
  SET_SCREEN_SHARE_STREAM,
} from './actionTypes';

/**
 * Dispatched when a user selects a screen to share.
 *
 * @param {{}} stream - The screen capture source ID.ß
 * @return {{}} - Action
 */
export function setScreenShareStream(stream) {
  return {
    type: SET_SCREEN_SHARE_STREAM,
    stream,
  };
}
