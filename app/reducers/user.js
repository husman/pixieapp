import {
  SET_USER_INFO,
  USER_SIGN_OUT,
} from '../actions/user';

/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */
const initialState = {
  firstName: process.env.FIRSTNAME || '',
  lastName: process.env.LASTNAME || '',
};

export default function chat(state = initialState, action) {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        firstName: action.firstName,
        isSignedIn: true,
      };
    case USER_SIGN_OUT:
      return {
        ...state,
        isSignedIn: false,
      };
    default:
      return state;
  }
}
