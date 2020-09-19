/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import { fork, select, takeEvery } from 'redux-saga/effects';
import io from 'socket.io-client';
import {
  TOGGLE_LOCAL_VIDEO,
  TOGGLE_LOCAL_AUDIO,
  START_SCREEN_SHARING,
  STOP_SCREEN_SHARING,
} from '../actions/video';
import {
  SEND_CHAT_TEXT,
} from '../actions/chat';
import {
  sendChatMessageToPeers,
} from '../api/chat';
import SocketClient from '../lib/SocketClient';
import { CANVAS_UPLOAD_COMPLETE } from '../actions/actionTypes';
import CanvasLib from '../lib/Canvas';
import userSagas from './user';
import { SET_MEETING_INFO, USER_LEFT, USER_SIGN_OUT } from '../actions/user';
import {
  init as initWebRtc,
  disconnect as disconnectWebRtc,
  publishVideo,
  unpublishVideo,
  publishAudio,
  unpublishAudio,
  publishScreenShare,
  unpublishScreenShare,
} from '../lib/WebRtcSession';

function sendChatMessage({
  user,
  text,
  date,
}) {
  sendChatMessageToPeers({
    user,
    text,
    date: date && date.toJSON(),
  });
}

function* connectToSession({
  displayName,
  meetingUrl,
}) {
  // Initialize the network socket.
  // const host = 'https://pixiehd.neetos.com';
  const host = 'http://pixie.neetos.com';
  // const host = 'http://localhost:4000';

  initWebRtc(meetingUrl);

  const socket = io(host, {
    autoConnect: true,
    query: `meetingId=${meetingUrl}&displayName=${displayName}`,
  });

  SocketClient.init(socket);
  CanvasLib.initRemoteEvents();
}

function* disconnectFromSession() {
  // Disconnect from signal server
  SocketClient.disconnect();

  // Disconnect from the OpenVidu server
  disconnectWebRtc();
}

function* stopScreenSharing() {
  yield unpublishScreenShare();
}

function* toggleLocalUserVideo() {
  const { isVideoEnabled } = yield select(({ view }) => view);

  if (isVideoEnabled) {
    yield publishVideo();
  } else {
    yield unpublishVideo();
  }
}

function* toggleLocalUserAudio() {
  const { isMicEnabled } = yield select(({ view }) => view);

  if (isMicEnabled) {
    yield publishAudio();
  } else {
    yield unpublishAudio();
  }
}

function* canvasUploadComplete({
  file: {
    type,
    url, // provided by image uploads
    urls, // provided by pdf uploads
  },
}) {
  switch (type) {
    case 'image':
      CanvasLib.onAddImageToCanvas(url);
      break;
    case 'pdf':
      CanvasLib.onAddImageToCanvas(urls[0]);
      break;
    default:
      console.error('unrecognized image type');
  }
}

function* initScreenShareVideo({
  sourceId,
}) {
  yield publishScreenShare(sourceId);
}

function* userLeft({
  user,
}) {
}

function* sagas() {
  yield takeEvery(SEND_CHAT_TEXT, sendChatMessage);
  yield takeEvery(SET_MEETING_INFO, connectToSession);
  yield takeEvery(TOGGLE_LOCAL_VIDEO, toggleLocalUserVideo);
  yield takeEvery(TOGGLE_LOCAL_AUDIO, toggleLocalUserAudio);
  yield takeEvery(STOP_SCREEN_SHARING, stopScreenSharing);
  yield takeEvery(CANVAS_UPLOAD_COMPLETE, canvasUploadComplete);
  yield takeEvery(USER_SIGN_OUT, disconnectFromSession);
  yield takeEvery(START_SCREEN_SHARING, initScreenShareVideo);
  yield takeEvery(USER_LEFT, userLeft);
  yield fork(userSagas);
}

export default sagas;
