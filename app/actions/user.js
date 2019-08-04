import io from 'socket.io-client';
import SocketClient from '../lib/SocketClient';

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
  firstName,
  lastName,
}) {
  // Initialize the network socket.
  const roomName = 'pixiedev';
  // const host = 'https://pixiehd.neetos.com';
  const host = 'http://localhost:4000';

  const socket = io(host, {
    autoConnect: true,
    query: `roomName=${roomName}&firstName=${firstName}&isMicEnabled=false`,
  });

  SocketClient.init(socket);

  return {
    type: SET_USER_INFO,
    firstName,
    lastName,
  };
}
