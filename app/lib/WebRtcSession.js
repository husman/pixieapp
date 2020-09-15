/**
 * Copyright 2020 Neetos LLC. All rights reserved.
 */
import { get } from './httpClient';
import {
  addRemoteStream,
  removeRemoteStream,
  setLocalVideoStream,
} from '../actions/video';

let store = null;
let OV = null;
let OvAudio = null;
let session = null;
let sessionAudio = null;
let subscriber = null;
let videoPublisher = null;
let audioPublisher = null;

export function setStore(value) {
  store = value;
}

export async function init(meetingUrl) {
  const { token } = await get(`http://pixie.neetos.com/token?meetingUrl=${meetingUrl}`);
  const { token: token2 } = await get(`http://pixie.neetos.com/token?meetingUrl=${meetingUrl}`);
  // const { token } = await get(`http://localhost:4000/token?meetingUrl=${meetingUrl}`);
  // const { token: token2 } = await get(`http://localhost:4000/token?meetingUrl=${meetingUrl}`);

  OV = new OpenVidu();
  OvAudio = new OpenVidu();
  session = OV.initSession();
  sessionAudio = OvAudio.initSession();

  initEvents();
  await session.connect(token);
  await sessionAudio.connect(token2);
}

export async function disconnect() {
  if (sessionAudio) {
    sessionAudio.disconnect();
  }

  if (session) {
    session.disconnect();
  }
}

export function isLocalConnectionId(connectionId) {
  const localConnectionIds = new Set();

  if (session && session.connection) {
    localConnectionIds.add(session.connection.connectionId);
  }

  if (sessionAudio && sessionAudio.connection) {
    localConnectionIds.add(sessionAudio.connection.connectionId);
  }

  return localConnectionIds.has(connectionId);
}

export function initEvents() {
  session.on('streamCreated', ({ stream }) => {
    if (isLocalConnectionId(stream.connection.connectionId)) {
      return;
    }

    subscriber = session.subscribe(stream);

    subscriber.on('streamPlaying', ({
      target: {
        stream: playingStream,
      },
    }) => {
      store.dispatch(addRemoteStream(playingStream.getMediaStream()));
    });

    const video = document.createElement('video');
    subscriber.addVideoElement(video)
  });

  session.on('streamDestroyed', ({ stream: mediaStream }) => {
    const stream = mediaStream.getMediaStream();

    if (!stream) {
      return;
    }

    if (stream && stream.connection && isLocalConnectionId(stream.connection.connectionId)) {
      return;
    }

    store.dispatch(removeRemoteStream(stream.id));
  });
}

export function* publishVideo() {
  const stream = yield OV.getUserMedia({
    audioSource: false,
  });
  const [videoSource] = stream.getVideoTracks();

  videoPublisher = OV.initPublisher(undefined, {
    videoSource,
    publishVideo: true,
    publishAudio: false,
    audioSource: null,
  });

  session.publish(videoPublisher);

  store.dispatch(setLocalVideoStream(stream));
}

export async function unpublishVideo() {
  if (!videoPublisher || !videoPublisher.stream) {
    return;
  }

  const stream = videoPublisher.stream.getMediaStream();

  if (!stream) {
    return;
  }

  stream
    .getVideoTracks()
    .forEach(track => track.stop());

  await session.unpublish(videoPublisher);

  store.dispatch(setLocalVideoStream(null));
  videoPublisher = null;
}

export function* publishAudio() {
  const stream = yield OV.getUserMedia({
    videoSource: false,
  });
  const [audioSource] = stream.getAudioTracks();

  audioPublisher = OvAudio.initPublisher(undefined, {
    audioSource,
    publishAudio: true,
    publishVideo: false,
    videoSource: null,
  });

  sessionAudio.publish(audioPublisher);
}

export async function unpublishAudio() {
  if (!audioPublisher || !audioPublisher.stream) {
    return;
  }

  const stream = audioPublisher.stream.getMediaStream();

  if (!stream) {
    return;
  }

  stream
    .getVideoTracks()
    .forEach(track => track.stop());

  await sessionAudio.unpublish(audioPublisher);
  audioPublisher = null;
}
