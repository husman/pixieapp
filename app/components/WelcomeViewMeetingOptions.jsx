import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
  ButtonContainer,
  LinkContainer,
  StyledContainer,
  WelcomeHeading,
  Link,
} from './signIn.styles';
import { showWelcomeView } from '../actions/view';
import {
  WELCOME_JOIN_MEETING_VIEW,
  WELCOME_NEW_MEETING_VIEW,
} from '../constants/app';

function WelcomeViewMeetingOptions({
  onJoinMeeting,
  onJoinNewMeeting,
}) {
  return (
    <StyledContainer maxWidth="sm">
      <WelcomeHeading>
        What would you like to do?
      </WelcomeHeading>

      <ButtonContainer>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onJoinMeeting}
        >
          Join a meeting
        </Button>
      </ButtonContainer>

      <ButtonContainer>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={onJoinNewMeeting}
        >
          Create a meeting
        </Button>
      </ButtonContainer>
    </StyledContainer>
  );
}

function mapStateToProps(state) {
  const {
    view: {
      welcomeView,
    },
  } = state;

  return {
    welcomeView,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onJoinMeeting: () => dispatch(showWelcomeView(WELCOME_JOIN_MEETING_VIEW)),
    onJoinNewMeeting: () => dispatch(showWelcomeView(WELCOME_NEW_MEETING_VIEW)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeViewMeetingOptions);
