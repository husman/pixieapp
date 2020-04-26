/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import { put, select, takeEvery } from 'redux-saga/effects';
import io from 'socket.io-client';
import axios from 'axios';
import {
  OPENTOK_STREAM_DESTROYED,
  remoteScreenSharingStopped,
  removeRemoteStream,
  TOGGLE_LOCAL_VIDEO,
  setLocalVideoStream,
} from '../actions/video';
import {
  SEND_CHAT_TEXT,
} from '../actions/chat';
import {
  sendChatMessageToPeers,
} from '../api/chat';
import SocketClient from '../lib/SocketClient';
import { setSessionId } from '../actions/view';
import { SET_USER_INFO } from '../actions/user';
import { CANVAS_UPLOAD_COMPLETE } from '../actions/actionTypes';
import CanvasLib from '../lib/Canvas';

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
  meetingId,
  firstName,
}) {
  // Initialize the network socket.
  const host = 'https://pixiehd.neetos.com';
  // const host = 'http://localhost:4000';

  const socket = io(host, {
    autoConnect: true,
    query: `roomName=${meetingId}&firstName=${firstName}&isMicEnabled=false`,
  });

  SocketClient.init(socket);

  try {
    const { data } = yield axios.post(`${host}/connect`, {
      meetingId,
    });
    yield put(setSessionId(data));
  } catch (err) {
    alert(`Could not connect to session: ${err.message}`);
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

function* sagas() {
  yield takeEvery(OPENTOK_STREAM_DESTROYED, remoteStreamDestroyed);
  yield takeEvery(SEND_CHAT_TEXT, sendChatMessage);
  yield takeEvery(SET_USER_INFO, connectToSession);
  yield takeEvery(TOGGLE_LOCAL_VIDEO, initLocalUserVideo);
  yield takeEvery(CANVAS_UPLOAD_COMPLETE, canvasUploadComplete);
}

export default sagas;
