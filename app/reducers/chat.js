/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */
import {
  REMOTE_CHAT_MESSAGE_RECEIVED,
  SEND_CHAT_TEXT,
} from '../actions/chat';
import {
  USER_JOINED, USER_LEFT,
} from '../actions/user';

const initialState = {
  messages: [],
};

export default function chat(state = initialState, action) {
  switch (action.type) {
    case SEND_CHAT_TEXT:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'local-message',
            user: 'Haleeq',
            message: action.text,
            date: action.date,
          },
        ],
      };
    case REMOTE_CHAT_MESSAGE_RECEIVED:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'remote-message',
            user: action.user,
            message: action.text,
            date: action.date,
          },
        ],
      };
    case USER_JOINED:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'notice',
            noticeType: 'user-joined',
            user: action.user.firstName,
            date: new Date(),
          },
        ],
      };
    case USER_LEFT:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'notice',
            noticeType: 'user-left',
            user: action.user.firstName,
            date: new Date(),
          },
        ],
      };
    default:
      return state;
  }
}
