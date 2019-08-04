/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import { put, select, takeEvery } from 'redux-saga/effects';
import {
  OPENTOK_STREAM_DESTROYED,
  remoteScreenSharingStopped,
  removeRemoteStream,
} from '../actions/video';
import {
  SEND_CHAT_TEXT,
} from '../actions/chat';
import {
  sendChatMessageToPeers,
} from '../api/chat';

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

function* sagas() {
  yield takeEvery(OPENTOK_STREAM_DESTROYED, remoteStreamDestroyed);
  yield takeEvery(SEND_CHAT_TEXT, sendChatMessage);
}

export default sagas;
