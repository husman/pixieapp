export const USER_JOINED = 'USER_JOINED';
export const USER_LEFT = 'USER_LEFT';

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
