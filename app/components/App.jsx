import React, { Fragment } from 'react';
import {
  arrayOf,
  bool,
  instanceOf,
  number,
  shape,
  string,
} from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  APP_VIEW_USER_VIDEOS,
  APP_VIEW_CANVAS,
  WELCOME_JOIN_MEETING_VIEW,
  WELCOME_MEETING_OPTIONS_VIEW,
  WELCOME_NEW_MEETING_VIEW,
  WELCOME_VIEW_SIGN_IN,
  WELCOME_VIEW_SIGN_UP,
  WELCOME_VIEW_SIGN_UP_SUCCESSFUL,
} from '../constants/app';
import CanvasView from './CanvasView';
import Header from './Header';
import RightToolbar from './RightToolbar';
import LocalUserVideo from './LocalUserVideo';
import MediaToolbar from './MediaToolbar';
import Dialogs from './Dialogs';
import VideosView from './VideosView';
import Chat from './Chat';
import WelcomeViewJoinMeeting from './WelcomeViewJoinMeeting';
import WelcomeViewMeetingOptions from './WelcomeViewMeetingOptions';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SignUpSuccess from './SignUpSuccess';
import UserAudio from './UserAudio';

const StyledContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  position: relative;
`;

const StyledLocalVideoContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 10px;
`;

function App({
  guest,
  isVideoEnabled,
  mode,
  isRightPanelOpened,
  isSignedIn,
  welcomeView,
  meetingId,
  remoteAudioStreams,
}) {
  return (
    <Fragment>
      <CssBaseline />
      {!isSignedIn && !meetingId && welcomeView === WELCOME_VIEW_SIGN_IN && (
        <SignIn />
      )}
      {!isSignedIn && !meetingId && welcomeView === WELCOME_VIEW_SIGN_UP && (
        <SignUp />
      )}
      {!isSignedIn && !meetingId && welcomeView === WELCOME_VIEW_SIGN_UP_SUCCESSFUL && (
        <SignUpSuccess />
      )}
      {isSignedIn && !meetingId && welcomeView === WELCOME_MEETING_OPTIONS_VIEW && (
        <WelcomeViewMeetingOptions />
      )}
      {(isSignedIn || guest) && !meetingId && welcomeView === WELCOME_JOIN_MEETING_VIEW && (
        <WelcomeViewJoinMeeting />
      )}
      {isSignedIn && !meetingId && welcomeView === WELCOME_NEW_MEETING_VIEW && (
        <WelcomeViewJoinMeeting
          isNewMeeting
        />
      )}
      {isSignedIn && meetingId && (
        <StyledContainer className="video-mode-container">
          <Header />
          {!isRightPanelOpened && (
            <RightToolbar />
          )}
          {mode === APP_VIEW_USER_VIDEOS && (
            <VideosView />
          )}
          <CanvasView isMounted={mode === APP_VIEW_CANVAS} />
          {isVideoEnabled && (
            <StyledLocalVideoContainer>
              <LocalUserVideo />
            </StyledLocalVideoContainer>
          )}
          <MediaToolbar />
          {isRightPanelOpened && (
            <Chat />
          )}
          {remoteAudioStreams.map((stream) => (
            <UserAudio key={stream.id} stream={stream} />
          ))}
          <Dialogs />
        </StyledContainer>
      )}
    </Fragment>
  );
}

App.defaultProps = {
  isSignedIn: false,
  welcomeView: WELCOME_VIEW_SIGN_IN,
  meetingId: '',
  remoteAudioStreams: [],
};

App.propTypes = {
  firstName: string.isRequired,
  mode: number.isRequired,
  isVideoEnabled: bool.isRequired,
  isRightPanelOpened: bool,
  isSignedIn: bool,
  welcomeView: number,
  meetingId: string,
  remoteAudioStreams: arrayOf(
    instanceOf(MediaStream),
  ),
};

function mapStateToProps(state) {
  const {
    user: {
      isSignedIn,
      firstName,
    },
    view: {
      guest,
      meetingId,
      isVideoEnabled,
      mode,
      isRightPanelOpened,
      appUpdateDownloaded,
      welcomeView,
      remoteStreams,
    },
  } = state;

  return {
    guest,
    meetingId,
    isSignedIn,
    firstName,
    isVideoEnabled,
    mode,
    isRightPanelOpened,
    appUpdateDownloaded,
    welcomeView,
    remoteAudioStreams: remoteStreams.filter(({
      isScreenShare,
      stream,
    }) => {
      if (!stream || isScreenShare) {
        return false;
      }

      const audioTracks = stream.getAudioTracks();

      return audioTracks && audioTracks.length > 0;
    }),
  };
}

export default connect(mapStateToProps)(App);
