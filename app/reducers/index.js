/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import { combineReducers } from 'redux';
import canvas from './canvas';
import screenShare from './screenShare';
import view from './view';
import chat from './chat';
import user from './user';

export default combineReducers({
  canvas,
  chat,
  screenShare,
  view,
  user,
});
