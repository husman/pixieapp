export const USER_JOINED = 'USER_JOINED';
export const USER_LEFT = 'USER_LEFT';
export const SET_USER_INFO = 'SET_USER_INFO';
export const USER_SIGN_OUT = 'USER_SIGN_OUT';
export const USER_SIGN_IN = 'USER_SIGN_IN';
export const USER_SIGN_UP = 'USER_SIGN_UP';
export const JOIN_MEETING = 'JOIN_MEETING';
export const CREATE_MEETING = 'CREATE_MEETING';
export const USER_SIGN_IN_ERROR = 'USER_SIGN_IN_ERROR';
export const USER_SIGN_UP_SUCCESS = 'USER_SIGN_UP_SUCCESS';
export const USER_SIGN_UP_ERROR = 'USER_SIGN_UP_ERROR';
export const USER_SIGN_IN_UNVERIFIED = 'USER_SIGN_IN_UNVERIFIED';
export const RESEND_VERIFICATION_EMAIL = 'RESEND_VERIFICATION_EMAIL';
export const RESEND_VERIFICATION_EMAIL_SUCCESS = 'RESEND_VERIFICATION_EMAIL_SUCCESS';
export const USER_VERIFICATION_SUCCESS = 'USER_VERIFICATION_SUCCESS';
export const USER_VERIFICATION_ERROR = 'USER_VERIFICATION_ERROR';
export const CLOSE_USER_VERIFICATION_ALERT = 'CLOSE_USER_VERIFICATION_ALERT';
export const MEETING_GUEST_NOT_ENABLED = 'MEETING_GUEST_NOT_ENABLED';
export const MEETING_NOT_FOUND = 'MEETING_NOT_FOUND';
export const STOP_JOIN_MEETING_LOADING = 'STOP_JOIN_MEETING_LOADING';
export const SET_MEETING_INFO = 'SET_MEETING_INFO';
export const MEETING_CREATION_ERROR = 'MEETING_CREATION_ERROR';

export function userJoined(user, users) {
  return {
    type: USER_JOINED,
    user,
    users,
  };
}

export function userLeft(user, users) {
  return {
    type: USER_LEFT,
    user,
    users
  };
}

export function setUserInfo({
  id,
  email,
  firstName,
  lastName,
  meetingId,
}) {
  return {
    type: SET_USER_INFO,
    id,
    email,
    firstName,
    lastName,
    meetingId,
  };
}

export function joinMeeting({
  guest,
  meetingId,
  displayName,
}) {
  return {
    type: JOIN_MEETING,
    guest,
    meetingId,
    displayName,
  };
}

export function signOut() {
  return {
    type: USER_SIGN_OUT,
  }
}

export function signIn({
  email,
  password,
  rememberMe,
}) {
  return {
    type: USER_SIGN_IN,
    email,
    password,
    rememberMe,
  }
}

export function signUp({
  firstName,
  lastName,
  email,
  password,
}) {
  return {
    type: USER_SIGN_UP,
    firstName,
    lastName,
    email,
    password,
  }
}

export function userSignInError({ message }) {
  return {
    type: USER_SIGN_IN_ERROR,
    message,
  }
}

export function userSignUpError({ message }) {
  return {
    type: USER_SIGN_UP_ERROR,
    message,
  }
}

export function signUpSuccess() {
  return {
    type: USER_SIGN_UP_SUCCESS,
  }
}

export function signInUnverifiedAccount({
  email,
  verified,
}) {
  return {
    type: USER_SIGN_IN_UNVERIFIED,
    email,
    verified,
  }
}

export function resendVerificationEmail() {
  return {
    type: RESEND_VERIFICATION_EMAIL,
  }
}

export function userVerificationSuccess() {
  return {
    type: USER_VERIFICATION_SUCCESS,
  }
}

export function userVerificationError() {
  return {
    type: USER_VERIFICATION_ERROR,
  }
}

export function closeUserVerificationAlert() {
  return {
    type: CLOSE_USER_VERIFICATION_ALERT,
  }
}

export function meetingGuestNotEnabled() {
  return {
    type: MEETING_GUEST_NOT_ENABLED,
  }
}

export function meetingNotFound() {
  return {
    type: MEETING_NOT_FOUND,
  }
}

export function stopJoinMeetingLoading() {
  return {
    type: STOP_JOIN_MEETING_LOADING,
  }
}

export function setMeetingInfo({
  displayName,
  meetingId,
  meetingUrl,
}) {
  return {
    type: SET_MEETING_INFO,
    displayName,
    meetingId,
    meetingUrl,
  }
}

export function meetingCreationError() {
  return {
    type: MEETING_CREATION_ERROR,
  }
}

export function createMeeting({
  displayName,
  enableGuests,
}) {
  return {
    type: CREATE_MEETING,
    enableGuests,
    displayName,
  };
}
