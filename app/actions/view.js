export const OPEN_CHAT_PANEL = 'OPEN_RIGHT_PANEL';
export const OPEN_PARTICIPANTS_PANEL = 'OPEN_PARTICIPANTS_PANEL';
export const CLOSE_RIGHT_PANEL = 'CLOSE_RIGHT_PANEL';
export const SET_SESSION_ID = 'SET_SESSION_ID';
export const SET_APP_MODE = 'SET_APP_MODE';

export function openChatPanel() {
  return {
    type: OPEN_CHAT_PANEL,
  };
}

export function openParticipantsPanel() {
  return {
    type: OPEN_PARTICIPANTS_PANEL,
  };
}

export function closeRightPanel() {
  return {
    type: CLOSE_RIGHT_PANEL,
  };
}

export function setSessionId({
  apiKey,
  sessionId,
  token,
}) {
  return {
    type: SET_SESSION_ID,
    apiKey,
    sessionId,
    token,
  };
}

export function setAppMode(mode) {
  return {
    type: SET_APP_MODE,
    mode,
  };
}
