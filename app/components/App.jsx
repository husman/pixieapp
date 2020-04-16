import React, { useCallback } from 'react';
import {
  bool,
  number,
  string,
} from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import {
  ipcRenderer,
} from 'electron';

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

import { closeAppUpdateNotice } from '../actions/app';

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

const AppUpdateActionButtons = styled.div`
  padding-top: 10px;
`;

const InstallUpdatesActionButton = styled.div`
  display: inline;
  margin-right: 15px;
`;

function App({
  sessionId,
  apiKey,
  token,
  firstName,
  isVideoEnabled,
  mode,
  isRightPanelOpened,
  appUpdateAvailable,
  appUpdateDownloaded,
  onCloseAppUpdateNotice,
}) {
  if (!firstName) {
    return (
      <SignIn
        appUpdateAvailable={appUpdateAvailable}
        appUpdateDownloaded={appUpdateDownloaded}
        onCloseAppUpdateNotice={onCloseAppUpdateNotice}
      />
    );
  }

  const onInstallAndRestartApp = useCallback(() => {
    ipcRenderer.send('quit-and-install');
  }, []);

  return (
    <StyledContainer className="video-mode-container">
      <Header />
      {appUpdateAvailable && (
        <Snackbar
          open
          autoHideDuration={30000}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          onClose={onCloseAppUpdateNotice}
        >
          <Alert severity="info">
            Updates are available!
          </Alert>
        </Snackbar>
      )}
      {appUpdateDownloaded && (
        <Snackbar
          open
          autoHideDuration={30000}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          onClose={onCloseAppUpdateNotice}
        >
          <Alert severity="info">
            Updates are ready! would you like to install them now?
            <AppUpdateActionButtons>
              <InstallUpdatesActionButton>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={onInstallAndRestartApp}
                >
                  Install & Restart
                </Button>
              </InstallUpdatesActionButton>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={onCloseAppUpdateNotice}
              >
                Cancel
              </Button>
            </AppUpdateActionButtons>
          </Alert>
        </Snackbar>
      )}
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
  appUpdateAvailable: bool,
  appUpdateDownloaded: bool,
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
      appUpdateAvailable,
      appUpdateDownloaded,
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
    appUpdateAvailable,
    appUpdateDownloaded,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCloseAppUpdateNotice: () => dispatch(closeAppUpdateNotice()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
