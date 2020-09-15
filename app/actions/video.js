import { remote } from 'electron';

/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

export const TOGGLE_LOCAL_VIDEO = 'TOGGLE_LOCAL_VIDEO';
export const TOGGLE_LOCAL_AUDIO = 'TOGGLE_LOCAL_AUDIO';
export const ADD_REMOTE_STREAM = 'ADD_REMOTE_STREAM';
export const ADD_REMOTE_AUDIO = 'ADD_REMOTE_AUDIO';
export const REMOVE_REMOTE_STREAM = 'REMOVE_REMOTE_STREAM';
export const REMOTE_VIDEO_CHANGED = 'REMOTE_VIDEO_CHANGED';
export const REMOTE_AUDIO_CHANGED = 'REMOTE_AUDIO_CHANGED';
export const START_SCREEN_SHARING = 'START_SCREEN_SHARING';
export const STOP_SCREEN_SHARING = 'STOP_SCREEN_SHARING';
export const SET_SCREEN_SHARING_STREAM = 'SET_SCREEN_SHARING_STREAM';
export const OPEN_SCREEN_SHARE_DIALOG = 'OPEN_SCREEN_SHARE_DIALOG';
export const CLOSE_SCREEN_SHARE_DIALOG = 'CLOSE_SCREEN_SHARE_DIALOG';
export const REMOTE_SCREEN_SHARING_STOPPED = 'REMOTE_SCREEN_SHARING_STOPPED';
export const OPENTOK_STREAM_DESTROYED = 'OPENTOK_STREAM_DESTROYED';
export const SET_LOCAL_VIDEO_STREAM = 'SET_LOCAL_VIDEO_STREAM';
export const SET_LOCAL_AUDIO_STREAM = 'SET_LOCAL_AUDIO_STREAM';
export const UPDATE_REMOTE_STREAM = 'UPDATE_REMOTE_STREAM';

export function toggleLocalVideo() {
  return {
    type: TOGGLE_LOCAL_VIDEO,
  };
}

export function setLocalVideoStream(stream) {
  return {
    type: SET_LOCAL_VIDEO_STREAM,
    stream,
  };
}

export function setLocalAudioStream(stream) {
  return {
    type: SET_LOCAL_AUDIO_STREAM,
    stream,
  };
}

export function toggleLocalAudio() {
  return {
    type: TOGGLE_LOCAL_AUDIO,
  };
}

export function addRemoteStream(stream) {
  return {
    type: ADD_REMOTE_STREAM,
    stream,
  };
}

export function updateRemoteStream({
  streamId,
}) {
  return {
    type: UPDATE_REMOTE_STREAM,
    streamId,
  };
}

export function removeRemoteStream(streamId) {
  return {
    type: REMOVE_REMOTE_STREAM,
    streamId,
  };
}

export function remoteAudioChanged(streamId, value) {
  return {
    type: REMOTE_AUDIO_CHANGED,
    streamId,
    value,
  };
}

export function remoteVideoChanged(streamId, value) {
  return {
    type: REMOTE_VIDEO_CHANGED,
    streamId,
    value,
  };
}

export function startScreenSharing({
  sourceId,
}) {
  const windowManager = remote.require('electron-window-manager');
  const mainWindow = windowManager.get('main').object;
  const presenterOverlay = windowManager.get('presenter-overlay').object;
  const presenterToolbar = windowManager.get('presenter-toolbar').object;

  setTimeout(() => {
    mainWindow.hide();
    presenterOverlay.show();
    presenterToolbar.show();
  }, 100);

  return {
    type: START_SCREEN_SHARING,
    sourceId,
  };
}

export function closeScreenShareDialog() {
  const windowManager = remote.require('electron-window-manager');
  const mainWindow = windowManager.get('main').object;
  const presenterOverlay = windowManager.get('presenter-overlay').object;
  const presenterToolbar = windowManager.get('presenter-toolbar').object;

  setTimeout(() => {
    mainWindow.show();
    presenterOverlay.hide();
    presenterToolbar.hide();
  }, 100);

  return {
    type: CLOSE_SCREEN_SHARE_DIALOG,
  };
}

export function stopScreenSharing() {
  const windowManager = remote.require('electron-window-manager');
  const mainWindow = windowManager.get('main').object;
  const presenterOverlay = windowManager.get('presenter-overlay').object;
  const presenterToolbar = windowManager.get('presenter-toolbar').object;

  mainWindow.show();
  presenterOverlay.hide();
  presenterToolbar.hide();

  return {
    type: STOP_SCREEN_SHARING,
  };
}

export function setScreenShareStream(stream) {
  return {
    type: SET_SCREEN_SHARING_STREAM,
    stream,
  };
}

export function openScreenShareDialog(sources) {
  return {
    type: OPEN_SCREEN_SHARE_DIALOG,
    sources,
  };
}

export function remoteScreenSharingStopped() {
  return {
    type: REMOTE_SCREEN_SHARING_STOPPED,
  };
}

export function streamDestroyed(event) {
  return {
    type: OPENTOK_STREAM_DESTROYED,
    event,
  };
}
