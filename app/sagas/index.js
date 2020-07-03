/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import { fork, put, select, takeEvery } from 'redux-saga/effects';
import io from 'socket.io-client';
import axios from 'axios';
import {
  OPENTOK_STREAM_DESTROYED,
  remoteScreenSharingStopped,
  removeRemoteStream,
  TOGGLE_LOCAL_VIDEO,
  setLocalVideoStream,
  TOGGLE_LOCAL_AUDIO,
  setLocalAudioStream, START_SCREEN_SHARING, STOP_SCREEN_SHARING,
} from '../actions/video';
import {
  SEND_CHAT_TEXT,
} from '../actions/chat';
import {
  sendChatMessageToPeers,
} from '../api/chat';
import SocketClient from '../lib/SocketClient';
import { setSessionId } from '../actions/view';
import { uuid4 } from 'react-sketch/src/utils';
import { CANVAS_UPLOAD_COMPLETE } from '../actions/actionTypes';
import CanvasLib from '../lib/Canvas';
import userSagas from './user';
import { SET_MEETING_INFO, USER_LEFT, USER_SIGN_OUT } from '../actions/user';
import webRtcSession from '../lib/WebRtcSession';
import { getScreenSize } from '../utils/capture';

function* remoteStreamDestroyed({
  event: {
    stream: {
      id: streamId,
    },
  },
}) {
  const screenShareStreamId = yield select(({ view: { screenShareStreamId: id } }) => id);

  if (streamId === screenShareStreamId) {
    yield put(remoteScreenSharingStopped());
  } else {
    yield put(removeRemoteStream(streamId));
  }
}

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
  meetingId,
}) {
  // Initialize the network socket.
  // const host = 'https://pixiehd.neetos.com';
  const host = 'http://localhost:4000';

  const socket = io(host, {
    autoConnect: true,
    query: `meetingId=${meetingId}&displayName=${displayName}`,
  });

  SocketClient.init(socket);
  CanvasLib.initRemoteEvents();
  webRtcSession.init();
}

function* disconnectFromSession() {
  // Disconnect/clean-up WebRTC session
  webRtcSession.disconnect();

  // Disconnect from signal server
  SocketClient.disconnect();
}

function* cleanUpLocalUserVideo() {
  webRtcSession.unsetLocalVideoStream();
  yield put(setLocalVideoStream(null));
}

function* cleanUpLocalUserAudio() {
  webRtcSession.unsetLocalAudioStream();
  yield put(setLocalAudioStream(null));
}

function* stopScreenSharing() {
  webRtcSession.unsetLocalScreenShareStream();
}

function* toggleLocalUserVideo() {
  const { isVideoEnabled } = yield select(({ view }) => view);

  if (isVideoEnabled) {
    yield initLocalUserVideo();
  } else {
    yield cleanUpLocalUserVideo();
  }
}

function* toggleLocalUserAudio() {
  const { isMicEnabled } = yield select(({ view }) => view);

  if (isMicEnabled) {
    yield initLocalUserAudio();
  } else {
    yield cleanUpLocalUserAudio();
  }
}

function* initLocalUserVideo() {
  const isVideoEnabled = yield select(({ view }) => view.isVideoEnabled);
  const { mediaDevices } = navigator;
  let stream = null;

  try {
    const constraints = {
      audio: false,
      video: true,
    };

    if (isVideoEnabled) {
      stream = yield mediaDevices.getUserMedia(constraints);
    }

    yield put(setLocalVideoStream(stream));
    webRtcSession.setLocalVideoStream(stream);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Could not get media device to capture the screen', err);
  }
}

function* initLocalUserAudio() {
  const isMicEnabled = yield select(({ view }) => view.isMicEnabled);
  const { mediaDevices } = navigator;
  let stream = null;

  try {
    const constraints = {
      audio: true,
      video: false,
    };

    if (isMicEnabled) {
      stream = yield mediaDevices.getUserMedia(constraints);
    }

    yield put(setLocalAudioStream(stream));
    webRtcSession.setLocalAudioStream(stream);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Could not get media device to capture the screen', err);
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
  const {
    mediaDevices,
  } = navigator;
  const {
    width,
    height,
  } = getScreenSize();
  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sourceId,
        minWidth: width,
        minHeight: height,
        maxWidth: width,
        maxHeight: height,
      },
    },
  };

  try {
    const stream = yield mediaDevices.getUserMedia(constraints);
    webRtcSession.setLocalScreenShareStream(stream);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Could not get media device to capture the screen', err);
  }
}

function* userLeft({
  user,
}) {
  webRtcSession.onUserLeft(user);
}

function* sagas() {
  yield takeEvery(OPENTOK_STREAM_DESTROYED, remoteStreamDestroyed);
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
