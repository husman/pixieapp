export const USER_JOINED = 'USER_JOINED';
export const USER_LEFT = 'USER_LEFT';
export const SET_USER_INFO = 'SET_USER_INFO';

export function userJoined(clientId, data) {
  const user = data.find(({ id }) => id === clientId) || {};

  return {
    type: USER_JOINED,
    data,
    user,
  };
}

export function userLeft(clientId, user) {
  return {
    type: USER_LEFT,
    clientId,
    user,
  };
}

export function setUserInfo({
  meetingId,
  firstName,
}) {
  return {
    type: SET_USER_INFO,
    meetingId,
    firstName,
  };
}
