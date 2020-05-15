import React, { useCallback, useState } from 'react';
import TextField from './TextField';
import SignInAudioSettings from './SignInAudioSettings';
import {
  JoinButton,
  JoinButtonContainer,
  LinkContainer,
  SectionLabel,
  SectionSubLabel,
  StyledContainer,
  WelcomeHeading,
  Link,
} from './signIn.styles';
import { connect } from 'react-redux';
import { setUserInfo } from '../actions/user';

function SignIn({
  fullName,
  meetingId,
  onJoin,
}) {
  const [meetingUrl, setMeetingUrl] = useState(meetingId);
  const [name, setName] = useState(fullName);

  const onMeetingUrlChange = useCallback((value) => {
    setMeetingUrl(value);
  }, [setMeetingUrl]);

  const onNameChange = useCallback((value) => {
    setName(value);
  }, [setName]);

  const onJoinClick = useCallback(() => {
    onJoin(meetingUrl, name);
  }, [onJoin, meetingUrl, name]);

  return (
    <StyledContainer maxWidth="sm">
      <WelcomeHeading>
        Welcome to your meeting
      </WelcomeHeading>

      <TextField
        required
        label="Your Meeting URL"
        value={meetingUrl}
        onChange={onMeetingUrlChange}
      />

      <TextField
        required
        label="Your Name (Other participants will see this)"
        value={name}
        onChange={onNameChange}
      />

      <SectionLabel>
        Your Audio + Video Settings
      </SectionLabel>

      <SectionSubLabel>
        (You can update these settings once the meeting begins)
      </SectionSubLabel>

      <SignInAudioSettings />

      <JoinButtonContainer>
        <JoinButton
          variant="contained"
          color="primary"
          onClick={onJoinClick}
        >
          Join Meeting
        </JoinButton>
      </JoinButtonContainer>

      <LinkContainer>
        <Link href="#">
          Need help joining your meeting?
        </Link>
      </LinkContainer>

      <LinkContainer>
        <Link href="#">
          Need an account?
        </Link>
      </LinkContainer>
    </StyledContainer>
  );
}

function mapStateToProps(state) {
  const {
    view: {
      isMicEnabled,
      isVideoEnabled,
    },
  } = state;

  return {
    isMicEnabled,
    isVideoEnabled,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onJoin: (meetingId, firstName) => dispatch(setUserInfo({ meetingId, firstName })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
