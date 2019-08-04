import React from 'react';
import { FormattedDate } from 'react-intl';
import {
  instanceOf,
  string,
} from 'prop-types';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: inline-block;
  text-align: left;
  margin-top: 25px;
`;

const StyledTextContainer = styled.div`
  display: inline-block;
  background-color: #EBF0F6;
  border-radius: 2px;
  padding: 10px;
  margin-bottom: 5px;
`;

const StyledText = styled.div`
  color: black;
`;

const StyledDate = styled.div`
  font-size: 0.9em;
  color: #828282;
  text-align: left;
`;

const StyledName = styled.div`
  color: black;
  font-weight: bold;
  font-size: 0.9em
  text-align: left;
  margin-bottom: 5px;
`;

function ChatLocalText({
  user,
  text,
  date,
}) {
  return (
    <StyledContainer>
      <StyledName>
        {user}
      </StyledName>
      <StyledTextContainer>
        <StyledText>
          {text}
        </StyledText>
      </StyledTextContainer>
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

ChatLocalText.propTypes = {
  user: string.isRequired,
  text: string.isRequired,
  date: instanceOf(Date).isRequired,
};

export default ChatLocalText;
