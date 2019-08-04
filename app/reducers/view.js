/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */
import { SET_SCREEN_SHARE_STREAM } from '../actions/actionTypes';
import {
  TOGGLE_LOCAL_AUDIO,
  TOGGLE_LOCAL_VIDEO,
  ADD_REMOTE_VIDEO,
  REMOTE_AUDIO_CHANGED,
  REMOTE_VIDEO_CHANGED,
  START_SCREEN_SHARING,
  STOP_SCREEN_SHARING,
  SET_SCREEN_SHARING_STREAM,
  REMOTE_SCREEN_SHARING_STOPPED,
  REMOVE_REMOTE_STREAM,
} from '../actions/video';
import {
  APP_VIEW_USER_VIDEOS,
  APP_VIEW_SCREEN_SHARE,
} from '../constants/app';
import {
  OPEN_CHAT_PANEL,
  OPEN_PARTICIPANTS_PANEL,
  CLOSE_RIGHT_PANEL,
} from '../actions/view';
import {
  USER_JOINED, USER_LEFT,
} from '../actions/user';
import { REMOTE_CHAT_MESSAGE_RECEIVED } from '../actions/chat';

/**
 * The initial state for the canvas.
 *
 * @type {{}}
 */
const initialState = {
  mode: APP_VIEW_USER_VIDEOS,
  isMicEnabled: false,
  isVideoEnabled: false,
  localVideo: null,
  remoteStreams: [],
  screenShareStream: null,
  users: [],
  chatAlertCount: 0,
};

/**
 * The main reducer for the the app views.
 *
 * @param {{}} state - The current state for the app views.
 * @param {{}} action - The action's parameters.
 *
 * @return {{}} - new state
 */
export default function view(state = initialState, action) {
  switch (action.type) {
    case CLOSE_RIGHT_PANEL:
      return {
        ...state,
        isRightPanelOpened: false,
        isChatPanelOpened: false,
        isParticipantsPanelOpened: false,
      };
    case OPEN_CHAT_PANEL:
      return {
        ...state,
        isRightPanelOpened: true,
        isChatPanelOpened: true,
        isParticipantsPanelOpened: false,
        chatAlertCount: 0,
      };
    case OPEN_PARTICIPANTS_PANEL:
      return {
        ...state,
        isRightPanelOpened: true,
        isChatPanelOpened: false,
        isParticipantsPanelOpened: true,
      };
    case REMOTE_CHAT_MESSAGE_RECEIVED:
      return {
        ...state,
        chatAlertCount: state.chatAlertCount + (!state.isChatPanelOpened ? 1 : 0),
      };
    case SET_SCREEN_SHARE_STREAM:
      return {
        ...state,
        mode: APP_VIEW_USER_VIDEOS,
      };
    case TOGGLE_LOCAL_AUDIO:
      return {
        ...state,
        isMicEnabled: !state.isMicEnabled,
      };
    case TOGGLE_LOCAL_VIDEO:
      return {
        ...state,
        isVideoEnabled: action.isVideoEnabled,
        localVideo: action.stream,
      };
    case ADD_REMOTE_VIDEO:
      return {
        ...state,
        remoteStreams: [
          ...state.remoteStreams,
          action.value,
        ],
      };
    case REMOVE_REMOTE_STREAM:
      return {
        ...state,
        remoteStreams: state.remoteStreams.filter(({ streamId }) => streamId !== action.streamId),
      };
    case REMOTE_AUDIO_CHANGED:
      return {
        ...state,
        remoteStreams: state.remoteStreams.map((stream) => {
          if (stream.streamId !== action.streamId) {
            return stream;
          }

          return {
            ...stream,
            hasAudio: action.value,
          };
        }),
      };
    case REMOTE_VIDEO_CHANGED:
      return {
        ...state,
        remoteStreams: state.remoteStreams.map((stream) => {
          if (stream.streamId !== action.streamId) {
            return stream;
          }

          return {
            ...stream,
            hasVideo: action.value,
          };
        }),
      };
    case START_SCREEN_SHARING:
      return {
        ...state,
        isScreenSharing: true,
      };
    case STOP_SCREEN_SHARING:
      return {
        ...state,
        isScreenSharing: false,
      };
    case SET_SCREEN_SHARING_STREAM:
      return {
        ...state,
        mode: APP_VIEW_SCREEN_SHARE,
        isScreenSharing: false,
        screenShareStream: action.stream,
        screenShareStreamId: action.streamId,
      };
    case REMOTE_SCREEN_SHARING_STOPPED:
      return {
        ...state,
        screenShareStream: null,
        screenShareStreamId: null,
      };
    case USER_JOINED:
      return {
        ...state,
        users: action.data,
      };
    case USER_LEFT:
      return {
        ...state,
        users: state.users.filter(({ id }) => id !== action.clientId),
      };
    default:
      return state;
  }
}
