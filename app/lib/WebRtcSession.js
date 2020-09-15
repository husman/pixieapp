/**
 * Copyright 2020 Neetos LLC. All rights reserved.
 */
import { get } from './httpClient';
import {
  addRemoteStream,
  remoteScreenSharingStopped,
  removeRemoteStream,
  setLocalVideoStream,
  setScreenShareStream,
} from '../actions/video';

let store = null;
let OV = null;
let OvAudio = null;
let OvScreenShare = null;
let session = null;
let sessionAudio = null;
let sessionScreenShare = null;
let subscriber = null;
let videoPublisher = null;
let screenSharePublisher = null;
let audioPublisher = null;

export function setStore(value) {
  store = value;
}

export async function init(meetingUrl) {
  const { token: videoSessionToken } = await get(`http://pixie.neetos.com/token?meetingUrl=${meetingUrl}`);
  const { token: audioSessionToken } = await get(`http://pixie.neetos.com/token?meetingUrl=${meetingUrl}`);
  const { token: screenShareSessionToken } = await get(`http://pixie.neetos.com/token?meetingUrl=${meetingUrl}`);
  // const { token: videoSessionToken } = await get(`http://localhost:4000/token?meetingUrl=${meetingUrl}`);
  // const { token: audioSessionToken } = await get(`http://localhost:4000/token?meetingUrl=${meetingUrl}`);
  // const { token: screenShareSessionToken } = await get(`http://localhost:4000/token?meetingUrl=${meetingUrl}`);

  OV = new OpenVidu();
  OvAudio = new OpenVidu();
  OvScreenShare = new OpenVidu();
  session = OV.initSession();
  sessionAudio = OvAudio.initSession();
  sessionScreenShare = OvScreenShare.initSession();

  initEvents();
  await session.connect(videoSessionToken);
  await sessionAudio.connect(audioSessionToken);
  await sessionScreenShare.connect(screenShareSessionToken);
}

export async function disconnect() {
  if (sessionAudio) {
    sessionAudio.disconnect();
  }

  if (sessionScreenShare) {
    sessionScreenShare.disconnect();
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

  if (sessionScreenShare && sessionScreenShare.connection) {
    localConnectionIds.add(sessionScreenShare.connection.connectionId);
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
      const mediaStream = playingStream.getMediaStream();

      if (playingStream.typeOfVideo === 'SCREEN') {
        store.dispatch(setScreenShareStream(mediaStream));
      } else {
        store.dispatch(addRemoteStream(mediaStream));
      }
    });

    const video = document.createElement('video');
    subscriber.addVideoElement(video)
  });

  session.on('streamDestroyed', ({ stream: mediaStream }) => {
    if (mediaStream.typeOfVideo === 'SCREEN') {
      store.dispatch(remoteScreenSharingStopped());
      return;
    }

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

export async function publishVideo() {
  const stream = await OV.getUserMedia({
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

export async function publishAudio() {
  const stream = await OvAudio.getUserMedia({
    videoSource: false,
  });
  const [audioSource] = stream.getAudioTracks();

  audioPublisher = OvAudio.initPublisher(undefined, {
    audioSource,
    publishAudio: true,
    publishVideo: false,
    videoSource: null,
  });

  await sessionAudio.publish(audioPublisher);
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

export async function publishScreenShare(sourceId) {
  const stream = await OvScreenShare.getUserMedia({
    videoSource: `screen:${sourceId}`,
    audioSource: false,
  });
  const [videoSource] = stream.getVideoTracks();

  videoSource.isScreenShare = true;

  screenSharePublisher = OvScreenShare.initPublisher(undefined, {
    videoSource,
    publishVideo: true,
    publishAudio: false,
    audioSource: null,
  });

  sessionScreenShare.publish(screenSharePublisher);
}

export async function unpublishScreenShare() {
  if (!screenSharePublisher || !screenSharePublisher.stream) {
    return;
  }

  const stream = screenSharePublisher.stream.getMediaStream();

  if (!stream) {
    return;
  }

  stream
    .getVideoTracks()
    .forEach(track => track.stop());

  await sessionScreenShare.unpublish(screenSharePublisher);
  screenSharePublisher = null;
}
