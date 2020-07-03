/**
 * Copyright 2020 Neetos LLC. All rights reserved.
 */

import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import log from 'electron-log';
import {
  USER_SIGN_IN,
  USER_SIGN_UP,
  JOIN_MEETING,
  CREATE_MEETING,
  setUserInfo,
  userSignInError,
  signUpSuccess,
  userSignUpError,
  signInUnverifiedAccount,
  meetingGuestNotEnabled,
  meetingNotFound,
  stopJoinMeetingLoading,
  setMeetingInfo,
  meetingCreationError,
} from '../actions/user';
import store from '../lib/Store';

function* handleUserSignIn({
  email,
  password,
  rememberMe,
}) {
  try {
    const {
      data: {
        id,
        firstName,
        lastName,
        verified,
      },
    } = yield axios.post('http://pixie.neetos.com/login', { email, password });

    if (!verified) {
      return yield put(signInUnverifiedAccount({ email, verified }));
    }

    yield put(
      setUserInfo({
        id,
        email,
        firstName,
        lastName,
      }),
    );
  } catch (err) {
    log.error(err.message);

    yield put(userSignInError({
      message: err.message,
    }));
  } finally {
    // Remember the user's e-mail address if requested
    if (rememberMe) {
      store.set('signInEmail', email);
      store.set('signInRememberMe', rememberMe);
    } else {
      store.delete('signInRememberMe');
      store.delete('signInEmail');
    }
  }
}

function* handleUserSignUp({
  firstName,
  lastName,
  email,
  password,
}) {
  try {
    yield axios.post('http://pixie.neetos.com/signup', {
      firstName,
      lastName,
      email,
      password,
    });

    store.set('userVerified', 0);
    store.set('signInEmail', email);

    yield put(signUpSuccess());
  } catch (err) {
    log.error(err.message);

    yield put(userSignUpError({
      message: err.message,
    }));
  }
}

function* handleJoinMeeting({
  displayName,
  guest,
  meetingId: meetingUrl,
}) {
  try {
    const {
      data: {
        isGuestEnabled,
        meetingId,
      },
    } = yield axios.post('http://pixie.neetos.com/check', {
      meetingUrl,
    });

    if (guest && !isGuestEnabled) {
      yield put(meetingGuestNotEnabled());
    } else {
      yield put(setMeetingInfo({
        displayName,
        meetingId,
        meetingUrl,
      }));
    }
  } catch (error) {
    yield put(meetingNotFound())
  } finally {
    yield put(stopJoinMeetingLoading());
  }
}

function* handleCreateMeeting({
  displayName,
  enableGuests,
}) {
  try {
    const {
      data: {
        meetingId,
        meetingUrl,
      },
    } = yield axios.post('http://pixie.neetos.com/create', {
      enableGuests,
    });

    yield put(setMeetingInfo({
      displayName,
      meetingId,
      meetingUrl,
    }));
  } catch (error) {
    yield put(meetingCreationError());
  } finally {
    yield put(stopJoinMeetingLoading());
  }
}

function* userSagas() {
  yield takeEvery(USER_SIGN_IN, handleUserSignIn);
  yield takeEvery(USER_SIGN_UP, handleUserSignUp);
  yield takeEvery(JOIN_MEETING, handleJoinMeeting);
  yield takeEvery(CREATE_MEETING, handleCreateMeeting);
}

export default userSagas;
