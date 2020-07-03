import React, { useEffect, useRef } from 'react';
import {
  arrayOf,
  shape,
  string,
  func,
  instanceOf,
} from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { sendChatText } from '../actions/chat';
import ChatNoticeText from './ChatNoticeText';
import ChatRemoteText from './ChatRemoteText';
import ChatLocalText from './ChatLocalText';
import ChatTextfield from './ChatTextfield';
import { FormattedMessage } from 'react-intl';

const StyledChatBody = styled.div`
  flex: 1;
  text-align: center;
  padding: 0 25px 25px;
  overflow-y: auto;
`;

const StyledNoticeContainer = styled.div`
  text-align: center;
`;

const StyledLocalMessageContainer = styled.div`
  text-align: left;
`;

const StyledRemoteMessageContainer = styled.div`
  text-align: right;
`;


function ChatBody({
  displayName,
  messages,
  onSend,
}) {
  const chatBodyRef = useRef();
  useEffect(() => {
    const { current: elem } = chatBodyRef;

    elem.scrollTop = elem.scrollHeight;
  });
  return (
    <React.Fragment>
      <StyledChatBody ref={chatBodyRef}>
        {messages.map(({
          type,
          user,
          message,
          noticeType,
          date,
        }) => (
          <React.Fragment key={`${type}${user}${date}`}>
            {type === 'notice' && noticeType === 'user-joined' && (
              <StyledNoticeContainer>
                <ChatNoticeText
                  text={(
                    <FormattedMessage
                      id="chat.notice.userJoined"
                      defaultMessage="{user} joined the meeting."
                      values={{
                        user,
                      }}
                    />
                  )}
                  date={date}
                />
              </StyledNoticeContainer>
            )}
            {type === 'notice' && noticeType === 'user-left' && (
              <StyledNoticeContainer>
                <ChatNoticeText
                  text={(
                    <FormattedMessage
                      id="chat.notice.userJoined"
                      defaultMessage="{user} left the meeting."
                      values={{
                        user,
                      }}
                    />
                  )}
                  date={date}
                />
              </StyledNoticeContainer>
            )}
            {type === 'local-message' && (
              <StyledLocalMessageContainer>
                <ChatLocalText
                  user={user}
                  text={message}
                  date={date}
                />
              </StyledLocalMessageContainer>
            )}
            {type === 'remote-message' && (
              <StyledRemoteMessageContainer>
                <ChatRemoteText
                  user={user}
                  text={message}
                  date={date}
                />
              </StyledRemoteMessageContainer>
            )}
          </React.Fragment>
        ))}
      </StyledChatBody>
      <ChatTextfield
        user={displayName}
        onSend={onSend}
      />
    </React.Fragment>
  );
}

ChatBody.propTypes = {
  messages: arrayOf(
    shape({
      type: string.isRequired,
      user: string.isRequired,
      message: string,
      noticeType: string,
      date: instanceOf(Date).isRequired,
    }),
  ).isRequired,
  displayName: string.isRequired,
  onSend: func.isRequired,
};


function mapStateToProps(state) {
  const {
    user: {
      displayName,
    },
    chat: {
      messages,
    },
  } = state;

  return {
    displayName,
    messages,
  };
}

function mapDispatchToState(dispatch) {
  return {
    onSend: data => dispatch(sendChatText(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToState)(ChatBody);
