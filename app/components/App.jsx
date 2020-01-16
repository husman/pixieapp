import React from 'react';
import {
  bool,
  number,
  string,
} from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  APP_VIEW_USER_VIDEOS,
  APP_VIEW_SCREEN_SHARE,
  APP_VIEW_CANVAS,
} from '../constants/app';
import ScreenShareView from './ScreenShareView';
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
  firstName,
  isVideoEnabled,
  mode,
  isRightPanelOpened,
}) {
  if (!firstName) {
    return (<SignIn />);
  }

  return (
    <StyledContainer className="video-mode-container">
      <Header />
      {!isRightPanelOpened && (
        <RightToolbar />
      )}
      {mode === APP_VIEW_USER_VIDEOS && (
        <VideosView />
      )}
      {mode === APP_VIEW_SCREEN_SHARE && (
        <ScreenShareView />
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
  );
}

App.propTypes = {
  firstName: string.isRequired,
  sessionId: string.isRequired,
  apiKey: string.isRequired,
  token: string.isRequired,
  mode: number.isRequired,
  isVideoEnabled: bool.isRequired,
  isRightPanelOpened: bool,
};

function mapStateToProps(state) {
  const {
    user: {
      firstName,
    },
    view: {
      sessionId,
      apiKey,
      token,
      isVideoEnabled,
      mode,
      isRightPanelOpened,
    },
  } = state;

  return {
    sessionId,
    apiKey,
    token,
    firstName,
    isVideoEnabled,
    mode,
    isRightPanelOpened,
  };
}

export default connect(mapStateToProps)(App);
