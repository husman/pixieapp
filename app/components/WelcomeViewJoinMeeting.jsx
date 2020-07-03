import React, { useCallback, useState } from 'react';
import {
  bool,
  func,
  string,
} from 'prop-types';
import { connect } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
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
  Spinner,
} from './signIn.styles';
import { createMeeting, joinMeeting } from '../actions/user';
import { showWelcomeView } from '../actions/view';
import {
  WELCOME_JOIN_MEETING_VIEW,
  WELCOME_NEW_MEETING_VIEW,
  WELCOME_VIEW_SIGN_IN,
} from '../constants/app';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function WelcomeViewJoinMeeting({
  isNewMeeting,
  displayName,
  meetingId,
  isSignedIn,
  isJoinMeetingLoading,
  meetingGuestDisabled,
  meetingNotFound,
  onJoinMeeting,
  onJoinNewMeeting,
  onJoinExistingMeeting,
  onSignIn,
  onCreateMeeting,
}) {
  const [meetingUrl, setMeetingUrl] = useState(meetingId || 'http://pixie.neetos.com/meeting/1386c4aa-3dee-4f73-a2d4-aa6b8e968684');
  const [alias, setName] = useState(displayName);
  const [enableGuests, setEnableGuests] = useState(false);

  const onEnableGuestsChange = useCallback(({ target: { checked } }) => {
    setEnableGuests(checked);
  }, [setEnableGuests]);

  const onMeetingUrlChange = useCallback((value) => {
    setMeetingUrl(value);
  }, [setMeetingUrl]);

  const onNameChange = useCallback((value) => {
    setName(value);
  }, [setName]);

  const onJoinClick = useCallback(() => {
    onJoinMeeting(meetingUrl, alias);
  }, [onJoinMeeting, meetingUrl, alias]);

  const onStartNewMeeting = useCallback(() => {
    onCreateMeeting(enableGuests, displayName);
  }, [onCreateMeeting, enableGuests, displayName]);

  return (
    <StyledContainer maxWidth="sm">
      {meetingGuestDisabled ? (
        <Alert severity="error">
          Guests have been disabled for this meeting. Please contact the meeting creator.
        </Alert>
      ) : null}

      {meetingNotFound ? (
        <Alert severity="error">
          The meeting you have entered was not found. Please double check the URL.
        </Alert>
      ) : null}

      <WelcomeHeading>
        Welcome to your meeting
      </WelcomeHeading>

      {!isNewMeeting && (
        <TextField
          required
          label="Your Meeting URL"
          value={meetingUrl}
          onChange={onMeetingUrlChange}
        />
      )}

      {!isNewMeeting ? (
        <TextField
          required
          label="Your Name (Other participants will see this)"
          value={alias}
          onChange={onNameChange}
        />
      ) : null}

      {isNewMeeting ? (
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              onChange={onEnableGuestsChange}
              value={enableGuests}
            />
          }
          label="Allow guests"
        />
      ) : null}

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
          onClick={isNewMeeting ? onStartNewMeeting : onJoinClick}
        >
          {isNewMeeting && !isJoinMeetingLoading ? 'Start Meeting' : null}
          {!isNewMeeting && !isJoinMeetingLoading ? 'Join Meeting' : null}
          {isJoinMeetingLoading ? <Spinner size={24} /> : null}
        </JoinButton>
      </JoinButtonContainer>

      {isSignedIn && (
        <LinkContainer>
          <Link onClick={isNewMeeting ? onJoinExistingMeeting : onJoinNewMeeting}>
            {isNewMeeting && 'Join an existing meeting'}
            {!isNewMeeting && 'Create a new meeting'}
          </Link>
        </LinkContainer>
      )}

      {!isSignedIn && (
        <LinkContainer>
          <Link onClick={onSignIn}>
            Already a member? Sign in
          </Link>
        </LinkContainer>
      )}
    </StyledContainer>
  );
}

WelcomeViewJoinMeeting.propTypes = {
  isNewMeeting: bool,
  displayName: string,
  onJoinMeeting: func.isRequired,
};

WelcomeViewJoinMeeting.defaultProps = {
  isNewMeeting: false,
  displayName: '',
};

function mapStateToProps(state) {
  const {
    user: {
      displayName,
      isSignedIn,
    },
    view: {
      guest,
      isMicEnabled,
      isVideoEnabled,
      isJoinMeetingLoading,
      meetingGuestDisabled,
      meetingNotFound,
    },
  } = state;

  return {
    guest,
    displayName,
    isSignedIn,
    isMicEnabled,
    isVideoEnabled,
    isJoinMeetingLoading,
    meetingGuestDisabled,
    meetingNotFound,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onJoinMeeting: (meetingId, displayName, guest) => dispatch(joinMeeting({ meetingId, displayName, guest })),
    onJoinNewMeeting: () => dispatch(showWelcomeView(WELCOME_NEW_MEETING_VIEW)),
    onJoinExistingMeeting: () => dispatch(showWelcomeView(WELCOME_JOIN_MEETING_VIEW)),
    onSignIn: () => dispatch(showWelcomeView(WELCOME_VIEW_SIGN_IN)),
    onCreateMeeting: (enableGuests, displayName) => dispatch(createMeeting({ enableGuests, displayName })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeViewJoinMeeting);
