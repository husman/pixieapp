/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */
import {
  CANVAS_INSERT_IMAGE_DOCUMENT,
  SET_SCREEN_SHARE_STREAM,
} from '../actions/actionTypes';
import {
  TOGGLE_LOCAL_AUDIO,
  TOGGLE_LOCAL_VIDEO,
  ADD_REMOTE_STREAM,
  REMOTE_AUDIO_CHANGED,
  REMOTE_VIDEO_CHANGED,
  START_SCREEN_SHARING,
  STOP_SCREEN_SHARING,
  SET_SCREEN_SHARING_STREAM,
  REMOTE_SCREEN_SHARING_STOPPED,
  REMOVE_REMOTE_STREAM,
  SET_LOCAL_VIDEO_STREAM,
  SET_LOCAL_AUDIO_STREAM,
  ADD_REMOTE_AUDIO,
  UPDATE_REMOTE_STREAM,
} from '../actions/video';
import {
  APP_VIEW_CANVAS,
  APP_VIEW_USER_VIDEOS,
  WELCOME_MEETING_OPTIONS_VIEW,
  WELCOME_VIEW_SIGN_UP_SUCCESSFUL,
} from '../constants/app';
import {
  OPEN_CHAT_PANEL,
  OPEN_PARTICIPANTS_PANEL,
  CLOSE_RIGHT_PANEL,
  SET_SESSION_ID,
  SET_APP_MODE,
  OPEN_ADD_PANEL,
  SHOW_WELCOME_VIEW,
} from '../actions/view';
import {
  SET_USER_INFO,
  USER_LEFT,
  USER_SIGN_UP_ERROR,
  USER_SIGN_IN,
  USER_SIGN_IN_ERROR,
  USER_SIGN_OUT,
  USER_SIGN_UP,
  USER_SIGN_UP_SUCCESS,
  USER_SIGN_IN_UNVERIFIED,
  RESEND_VERIFICATION_EMAIL,
  RESEND_VERIFICATION_EMAIL_SUCCESS,
  MEETING_GUEST_NOT_ENABLED,
  MEETING_NOT_FOUND,
  JOIN_MEETING,
  STOP_JOIN_MEETING_LOADING,
  SET_MEETING_INFO,
  MEETING_CREATION_ERROR,
  CREATE_MEETING,
  USER_JOINED,
} from '../actions/user';
import { REMOTE_CHAT_MESSAGE_RECEIVED } from '../actions/chat';
import {
  APP_UPDATE_AVAILABLE,
  APP_UPDATE_DOWNLOADED,
  CLOSE_APP_UPDATE_NOTICE,
} from '../actions/app';
import store from '../lib/Store';

/**
 * The initial state for the canvas.
 *
 * @type {{}}
 */
const initialState = {
  mode: APP_VIEW_CANVAS,
  isMicEnabled: false,
  isVideoEnabled: false,
  localVideo: null,
  remoteStreams: [],
  screenShareStream: null,
  users: [],
  chatAlertCount: 0,
  meetingId: '',
  apiKey: '',
  sessionId: '',
  token: '',
  appUpdateAvailable: false,
  appUpdateDownloaded: false,
  signInEmail: store.get('signInEmail'),
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
        isAddPanelOpened: false,
        chatAlertCount: 0,
      };
    case OPEN_PARTICIPANTS_PANEL:
      return {
        ...state,
        isRightPanelOpened: true,
        isChatPanelOpened: false,
        isAddPanelOpened: false,
        isParticipantsPanelOpened: true,
      };
    case OPEN_ADD_PANEL:
      return {
        ...state,
        isRightPanelOpened: true,
        isChatPanelOpened: false,
        isParticipantsPanelOpened: false,
        isAddPanelOpened: true,
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
        isVideoEnabled: !state.isVideoEnabled,
      };
    case SET_LOCAL_VIDEO_STREAM:
      return {
        ...state,
        localVideo: action.stream,
      };
    case SET_LOCAL_AUDIO_STREAM:
      return {
        ...state,
        localAudio: action.stream,
      };
    case ADD_REMOTE_STREAM:
      const alreadyExists = state.remoteStreams.find(stream => stream.id === action.streamId);

      if (alreadyExists) {
        return state;
      }

      return {
        ...state,
        remoteStreams: [
          ...state.remoteStreams,
          {
            id: action.streamId,
            type: action.streamType,
          },
        ],
      };
    case ADD_REMOTE_AUDIO:
      return {
        ...state,
        remoteStreams: [
          ...state.remoteStreams,
          {
            type: 'audio',
            srcObject: action.srcObject,
          },
        ],
      };
    case REMOVE_REMOTE_STREAM:
      return {
        ...state,
        remoteStreams: state.remoteStreams.filter(({ id }) => id !== action.streamId),
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
    case UPDATE_REMOTE_STREAM:
      return {
        ...state,
        remoteStreams: state.remoteStreams.map((stream) => {
          if (stream.id !== action.stream.id) {
            return stream;
          }

          return {
            ...stream,
            srcObject: action.stream,
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
        mode: APP_VIEW_USER_VIDEOS,
        isScreenSharing: false,
        screenShareStream: action.stream,
        screenShareStreamId: action.streamId,
      };
    case REMOTE_SCREEN_SHARING_STOPPED:
      return {
        ...state,
        mode: APP_VIEW_USER_VIDEOS,
        screenShareStream: null,
        screenShareStreamId: null,
      };
    case USER_JOINED:
      return {
        ...state,
        users: action.users,
      };
    case USER_LEFT:
      return {
        ...state,
        users: action.users,
      };
    case SET_USER_INFO:
      return {
        ...state,
        welcomeView: WELCOME_MEETING_OPTIONS_VIEW,
        isSignInLoading: false,
      };
    case SET_SESSION_ID:
      return {
        ...state,
        apiKey: action.apiKey,
        sessionId: action.sessionId,
        token: action.token,
      };
    case SET_APP_MODE: {
      const isPreviousModeCanvas = state.mode === APP_VIEW_CANVAS;
      const newMode = action.mode;
      const isSwitchingModeFromCanvas = (
        isPreviousModeCanvas
        && state.isAddPanelOpened
        && newMode !== APP_VIEW_CANVAS
      );

      return {
        ...state,
        mode: action.mode,
        isRightPanelOpened: isSwitchingModeFromCanvas ? false : state.isRightPanelOpened,
        isAddPanelOpened: false,
      };
    }
    case APP_UPDATE_AVAILABLE:
      return {
        ...state,
        appUpdateAvailable: true,
        appUpdateDownloaded: false,
      };
    case APP_UPDATE_DOWNLOADED:
      return {
        ...state,
        appUpdateAvailable: false,
        appUpdateDownloaded: true,
      };
    case CLOSE_APP_UPDATE_NOTICE:
      return {
        ...state,
        appUpdateAvailable: false,
        appUpdateDownloaded: false,
      };
    case CANVAS_INSERT_IMAGE_DOCUMENT:
      return {
        ...state,
        isRightPanelOpened: false,
      };
    case SHOW_WELCOME_VIEW:
      return {
        ...state,
        welcomeView: action.view,
        guest: action.guest,
      };
    case USER_SIGN_IN:
      return {
        ...state,
        isSignInLoading: true,
        signInErrors: false,
      };
    case USER_SIGN_IN_ERROR:
      return {
        ...state,
        isSignInLoading: false,
        signInErrors: true,
      };
    case USER_SIGN_UP:
      return {
        ...state,
        isSignUpLoading: true,
        signUpErrors: false,
      };
    case USER_SIGN_UP_ERROR:
      return {
        ...state,
        isSignUpLoading: false,
        signUpErrors: true,
      };
    case USER_SIGN_UP_SUCCESS:
      return {
        ...state,
        isSignUpLoading: false,
        signUpErrors: false,
        welcomeView: WELCOME_VIEW_SIGN_UP_SUCCESSFUL,
      };
    case USER_SIGN_IN_UNVERIFIED:
      return {
        ...state,
        signInEmail: action.email,
        verified: action.verified,
        isSignInLoading: false,
      };
    case RESEND_VERIFICATION_EMAIL:
      return {
        ...state,
        isResendVerificationEmailLoading: true,
      };
    case RESEND_VERIFICATION_EMAIL_SUCCESS:
      return {
        ...state,
        isResendVerificationEmailLoading: false,
      };
    case MEETING_GUEST_NOT_ENABLED:
      return {
        ...state,
        meetingGuestDisabled: true,
        meetingNotFound: false,
      };
    case MEETING_NOT_FOUND:
      return {
        ...state,
        meetingGuestDisabled: false,
        meetingNotFound: true,
      };
    case JOIN_MEETING:
    case CREATE_MEETING:
      return {
        ...state,
        isJoinMeetingLoading: true,
        meetingCreationError: false,
      };
    case STOP_JOIN_MEETING_LOADING:
      return {
        ...state,
        isJoinMeetingLoading: false,
      };
    case SET_MEETING_INFO:
      return {
        ...state,
        meetingId: action.meetingId,
        meetingUrl: action.meetingUrl,
      };
    case MEETING_CREATION_ERROR:
      return {
        ...state,
        meetingCreationError: true,
      };
    case USER_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
}
