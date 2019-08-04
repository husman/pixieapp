export const SEND_CHAT_TEXT = 'SEND_CHAT_TEXT';
export const REMOTE_CHAT_MESSAGE_RECEIVED = 'REMOTE_CHAT_MESSAGE_RECEIVED';

export function sendChatText({
  user,
  text,
  date,
}) {
  return {
    type: SEND_CHAT_TEXT,
    text,
    user,
    date,
  };
}

export function remoteChatMessageReceived(clientId, { user, text, date }) {
  return {
    type: REMOTE_CHAT_MESSAGE_RECEIVED,
    clientId,
    user,
    text,
    date: new Date(date),
  };
}
