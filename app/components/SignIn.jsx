import React, { useCallback, useState } from 'react';
import {
  func,
} from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { setUserInfo } from '../actions/user';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { ipcRenderer } from 'electron';

const StyledLabel = styled.div`
  color: white;
`;
const AppUpdateActionButtons = styled.div`
  padding-top: 10px;
`;

const InstallUpdatesActionButton = styled.div`
  display: inline;
  margin-right: 15px;
`;

function SignIn({
  onSetUserInfo,
  appUpdateAvailable,
  appUpdateDownloaded,
  onCloseAppUpdateNotice,
}) {
  const [firstName, setFirstName] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const onSubmit = useCallback(() => {
    onSetUserInfo({
      firstName,
      meetingId,
    });
  }, [firstName, meetingId]);
  const onInstallAndRestartApp = useCallback(() => {
    ipcRenderer.send('quit-and-install');
  }, []);

  return (
    <div>
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
      <StyledLabel>
        Meeting ID (v0.4.0)
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
