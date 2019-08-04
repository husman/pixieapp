import React from 'react';
import {
  bool,
  number,
} from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  APP_VIEW_USER_VIDEOS,
  APP_VIEW_SCREEN_SHARE,
  APP_VIEW_CANVAS,
} from '../constants/app';
import ScreenShareView from './ScreenShareView';
import CanvasMode from './CanvasMode';
import OpentokSession from './OpentokSession';
import Header from './Header';
import RightToolbar from './RightToolbar';
import LocalUserVideo from './LocalUserVideo';
import MediaToolbar from './MediaToolbar';
import Dialogs from './Dialogs';
import VideosView from './VideosView';
import Chat from './Chat';

const StyledContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  position: relative;
`;

const StyledLocalVideoContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

function App({
  isVideoEnabled,
  mode,
  isRightPanelOpened,
}) {
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
        <CanvasMode />
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
      <OpentokSession />
    </StyledContainer>
  );
}

App.propTypes = {
  mode: number.isRequired,
  isVideoEnabled: bool.isRequired,
  isRightPanelOpened: bool,
};

function mapStateToProps(state) {
  const {
    view: {
      isVideoEnabled,
      mode,
      isRightPanelOpened,
    },
  } = state;

  return {
    isVideoEnabled,
    mode,
    isRightPanelOpened,
  };
}

export default connect(mapStateToProps)(App);
