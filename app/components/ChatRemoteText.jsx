import React from 'react';
import {
  instanceOf,
  string,
} from 'prop-types';
import { FormattedDate } from 'react-intl';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: inline-block;
  text-align: left;
  margin-top: 25px;
`;

const StyledTextContainer = styled.div`
  display: inline-block;
  background-color: #53BEF6;
  border-radius: 2px;
  padding: 10px;
  margin-bottom: 5px;
`;

const StyledText = styled.div`
  color: white;
`;

const StyledDate = styled.div`
  font-size: 0.9em;
  color: #828282;
  text-align: right;
`;

const StyledName = styled.div`
  color: black;
  font-weight: bold;
  font-size: 0.9em
  text-align: right;
  margin-bottom: 5px;
`;

function ChatRemoteText({
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

ChatRemoteText.propTypes = {
  user: string.isRequired,
  text: string.isRequired,
  date: instanceOf(Date).isRequired,
};

export default ChatRemoteText;
