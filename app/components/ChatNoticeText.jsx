import React from 'react';
import { FormattedDate } from 'react-intl';
import { string } from 'prop-types';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: inline-block;
  text-align: left;
  margin-top: 25px;
`;

const StyledText = styled.div`
  font-weight: bold;
  font-size: 1em;
  color: black;
  margin-bottom: 5px;
`;
const StyledDate = styled.div`
  font-size: 0.9em;
  color: #828282;
  text-align: center;
`;


function ChatNoticeText({
  text,
  date,
}) {
  return (
    <StyledContainer>
      <StyledText>
        {text}
      </StyledText>
      <StyledDate>
        <FormattedDate
          value={date}
          weekday="short"
          hour="numeric"
          minute="2-digit"
        />
      </StyledDate>
    </StyledContainer>
  );
}

ChatNoticeText.propTypes = {
  text: string.isRequired,
  date: string.isRequired,
};

export default ChatNoticeText;
