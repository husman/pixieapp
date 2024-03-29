import React from 'react';
import { connect } from 'react-redux';
import {
  arrayOf,
  shape,
  string,
  bool,
} from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Icon } from './Icon';

const StyledFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledFlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledMeetingUrlTextfield = styled.input`
  border: 1px solid #bfd4ed;
  flex: 1;
  height: 30px;
  font-size: 1em;
  padding: 8px;
  border-radius: 2px;
`;

const StyledLabel = styled.div`
  font-weight: bold;
`;

const StyledMeetingUrlLabel = styled(StyledLabel)`
  margin-bottom: 5px;
`;

const StyledUserListContainer = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #ebf0f6;
`;

const StyledFullWidthLabel = styled(StyledLabel)`
  flex: 1;
`;

const StyledBottomContainer = styled.div`
  flex: 1;
  position: relative;
`;

const StyledInviteButton = styled.a`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 114px;
  height: 38px;
  border: 2px solid #0177B5;
  border-radius: 4px;
  text-align: center;
  line-height: 38px;
  color: #0177B5;
  font-weight: bold;
  cursor: pointer;
`;

const StyledChatBody = styled.div`
  flex: 1;
  text-align: left;
  padding: 20px;
  overflow-y: auto;
`;

function ParticipantsBody({
  meetingUrl,
  users,
}) {
  return (
    <StyledChatBody>
      <StyledFlexContainer>
        <div>
          <StyledFlexContainer>
            <StyledMeetingUrlLabel>
              <FormattedMessage
                id="participants.meeting.url.label"
                defaultMessage="Your Meeting URL"
              />
            </StyledMeetingUrlLabel>
            <StyledMeetingUrlTextfield
              defaultValue={`http://pixie.neetos.com/meeting/${meetingUrl}`}
              readOnly
            />
          </StyledFlexContainer>
        </div>
        {users.map(({
          displayName,
          micEnabled,
        }) => (
          <StyledUserListContainer key={displayName}>
            <StyledFlexRowContainer>
              <StyledFullWidthLabel>
                {displayName}
              </StyledFullWidthLabel>
            </StyledFlexRowContainer>
          </StyledUserListContainer>
        ))}
      </StyledFlexContainer>
    </StyledChatBody>
  );
}

function mapStateToProps(state) {
  const {
    view: {
      meetingUrl,
      users,
    },
  } = state;

  return {
    meetingUrl,
    users,
  };
}

ParticipantsBody.propTypes = {
  meetingUrl: string.isRequired,
  users: arrayOf(
    shape({
      firstName: string.isRequired,
      isMicEnabled: bool,
    }),
  ).isRequired,
};

export default connect(mapStateToProps, null)(ParticipantsBody);
