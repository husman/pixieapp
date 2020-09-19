import {
  CLOSE_USER_VERIFICATION_ALERT,
  JOIN_MEETING,
  SET_MEETING_INFO,
  SET_USER_INFO,
  USER_SIGN_OUT,
  USER_VERIFICATION_ERROR,
  USER_VERIFICATION_SUCCESS,
} from '../actions/user';

/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */
const initialState = {};

export default function user(state = initialState, action) {
  switch (action.type) {
    case SET_USER_INFO: {
      const {
        id,
        email,
        firstName,
        lastName,
      } = action;

      return {
        ...state,
        id,
        email,
        firstName,
        lastName,
        displayName: firstName,
        isSignedIn: true,
        isVerified: true,
      };
    }
    case SET_MEETING_INFO:
      return {
        ...state,
        isSignedIn: true,
        displayName: action.displayName,
      };
    case USER_SIGN_OUT:
      return initialState;
    case JOIN_MEETING:
      return {
        ...state,
        displayName: action.displayName,
      };
    case USER_VERIFICATION_SUCCESS:
      return {
        ...state,
        isVerified: true,
        showVerificationAlert: true,
      };
    case USER_VERIFICATION_ERROR:
      return {
        ...state,
        isVerified: false,
        showVerificationAlert: true,
      };
    case CLOSE_USER_VERIFICATION_ALERT:
      return {
        ...state,
        showVerificationAlert: false,
      };
    default:
      return state;
  }
}
