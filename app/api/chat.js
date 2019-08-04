import { CHAT_PEER_EVENT_MESSAGE } from '../constants/chat';
import SocketClient from '../lib/SocketClient';

export function sendChatMessageToPeers(data) {
  SocketClient.emit(CHAT_PEER_EVENT_MESSAGE, data);
}
