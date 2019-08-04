import React, { useCallback, useState } from 'react';
import { func, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import AttachmentButton from '../svgs/attachment.svg';
import SendButton from '../svgs/send-chat.svg';

const StyledContainer = styled.div`
  padding: 5px;
  cursor: pointer;
`;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  border: 1px solid #bfd4ed;
  box-sizing: border-box;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  color: #979797;
`;

const StyledInput = styled.input`
  font-size: 15px;
  flex: 1;
  height: 100%;
  margin: 0 5px;
  border: 0;
  outline: none;
  background-color: transparent;
`;

const StyledAttachmentContainer = styled.div`
  margin-left: 10px;
  margin-top: 5px;
`;

const StyledSendButtonContainer = styled.div`
  margin-right: 10px;
  margin-top: 5px;
`;

function ChatTextfield({
  user,
  onSend,
}) {
  const [text, setText] = useState('');
  const onTextChange = useCallback(({ target: { value } }) => {
    setText(value);
  }, [text]);
  const sendMessage = useCallback(() => {
    onSend({
      user,
      text,
      date: new Date(),
    });
    setText('');
  }, [text]);
  const onKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }, [text]);

  return (
    <StyledContainer>
      <StyledContentContainer>
        <StyledAttachmentContainer>
          <AttachmentButton width="20" height="20" />
        </StyledAttachmentContainer>
        <FormattedMessage
          id="chat.textfield.placeholder.text"
          defaultMessage="Write a message..."
        >
          {placeholder => (
            <StyledInput
              placeholder={placeholder}
              onChange={onTextChange}
              value={text}
              onKeyPress={onKeyPress}
            />
          )}
        </FormattedMessage>
        <StyledSendButtonContainer>
          <SendButton
            width="35"
            height="35"
            onClick={sendMessage}
          />
        </StyledSendButtonContainer>
      </StyledContentContainer>
    </StyledContainer>
  );
}

ChatTextfield.propTypes = {
  onSend: func.isRequired,
  user: string.isRequired,
};

export default ChatTextfield;
