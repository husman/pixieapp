import React, { useCallback, useState } from 'react';
import {
  func,
} from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { setUserInfo } from '../actions/user';

const StyledLabel = styled.div`
  color: white;
`;

function SignIn({
  onSetUserInfo,
}) {
  const [firstName, setFirstName] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const onSubmit = useCallback(() => {
    onSetUserInfo({
      firstName,
      meetingId,
    });
  }, [firstName, meetingId]);

  return (
    <div>
      <StyledLabel>
        Meeting ID
      </StyledLabel>
      <input
        type="text"
        onChange={({ target: { value } }) => setMeetingId(value)}
        value={meetingId}
      />
      <StyledLabel>
        First name
      </StyledLabel>
      <input
        type="text"
        onChange={({ target: { value } }) => setFirstName(value)}
        value={firstName}
      />
      <div>
        <input
          type="button"
          value="Submit"
          onClick={onSubmit}
          disabled={!firstName || !meetingId}
        />
      </div>
    </div>
  );
}

SignIn.propTypes = {
  onSetUserInfo: func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onSetUserInfo: sessionData => dispatch(setUserInfo(sessionData)),
  };
}

export default connect(null, mapDispatchToProps)(SignIn);
