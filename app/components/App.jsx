import React, { Fragment } from 'react';
import {
  bool,
  number,
  string,
} from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  APP_VIEW_USER_VIDEOS,
  APP_VIEW_CANVAS,
} from '../constants/app';
import CanvasView from './CanvasView';
import OpentokSession from './OpentokSession';
import Header from './Header';
import RightToolbar from './RightToolbar';
import LocalUserVideo from './LocalUserVideo';
import MediaToolbar from './MediaToolbar';
import Dialogs from './Dialogs';
import VideosView from './VideosView';
import Chat from './Chat';
import SignIn from './SignIn';

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
  sessionId,
  apiKey,
  token,
  isVideoEnabled,
  mode,
  isRightPanelOpened,
  isSignedIn,
}) {
  return (
    <Fragment>
      <CssBaseline />
      {!isSignedIn && (
        <SignIn />
      )}
      {isSignedIn && (
        <StyledContainer className="video-mode-container">
          <Header />
          {!isRightPanelOpened && (
            <RightToolbar />
          )}
          {mode === APP_VIEW_USER_VIDEOS && (
            <VideosView />
          )}
          {mode === APP_VIEW_CANVAS && (
            <CanvasView />
          )}
          {isVideoEnabled && (
            <StyledLocalVideoContainer>
              <LocalUserVideo />
            </StyledLocalVideoContainer>
          )}
          <MediaToolbar />
          {isRightPanelOpened && (
            <Chat />
          )}
          <Dialogs />
          {sessionId && apiKey && token && (
            <OpentokSession />
          )}
        </StyledContainer>
      )}
    </Fragment>
  );
}

App.defaultProps = {
  isSignedIn: false,
};

App.propTypes = {
  firstName: string.isRequired,
  sessionId: string.isRequired,
  apiKey: string.isRequired,
  token: string.isRequired,
  mode: number.isRequired,
  isVideoEnabled: bool.isRequired,
  isRightPanelOpened: bool,
  isSignedIn: bool,
};

function mapStateToProps(state) {
  const {
    user: {
      isSignedIn,
      firstName,
    },
    view: {
      sessionId,
      apiKey,
      token,
      isVideoEnabled,
      mode,
      isRightPanelOpened,
      appUpdateDownloaded,
    },
  } = state;

  return {
    isSignedIn,
    sessionId,
    apiKey,
    token,
    firstName,
    isVideoEnabled,
    mode,
    isRightPanelOpened,
    appUpdateDownloaded,
  };
}

export default connect(mapStateToProps)(App);
