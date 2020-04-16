/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React from 'react';
import {
  func,
  bool,
} from 'prop-types';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import {
  StyledPresenterContainer,
} from './presenter.styles';
import {
  Icon,
} from './Icon';
import {
  toggleLocalVideo,
  openScreenShareDialog,
  toggleLocalAudio,
  stopScreenSharing,
} from '../actions/video';

function PresenterToolbar({
  isMicEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onOpenScreenShareDialog,
  onStopSharing,
}) {
  return (
    <StyledPresenterContainer>
      <Icon
        type="vertical-menu"
        color="white"
        marginRight={15}
      />
      <Icon
        type={isMicEnabled ? 'mic' : 'mic-off'}
        color={isMicEnabled ? 'black' : 'white'}
        backgroundColor={isMicEnabled ? 'white' : 'transparent'}
        border={2}
        marginRight={10}
        padding={10}
        borderColor="white"
        onClick={onToggleAudio}
      />
      <Icon
        type={isVideoEnabled ? 'video' : 'video-off'}
        color={isVideoEnabled ? 'black' : 'white'}
        backgroundColor={isVideoEnabled ? 'white' : 'transparent'}
        border={2}
        marginRight={10}
        padding={10}
        borderColor="white"
        onClick={onToggleVideo}
      />
      <Icon
        type="switch-screen"
        color="white"
        borderColor="white"
        border={2}
        marginRight={10}
        padding={10}
        onClick={onOpenScreenShareDialog}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={onStopSharing}
      >
        STOP SHARING
      </Button>
    </StyledPresenterContainer>
  );
}

function mapStateToProps(state) {
  const {
    view: {
      isVideoEnabled,
      isMicEnabled,
    },
  } = state;

  return {
    isVideoEnabled,
    isMicEnabled,
  };
}

function mapDispatchToState(dispatch) {
  return {
    onToggleAudio: () => dispatch(toggleLocalAudio()),
    onToggleVideo: () => dispatch(toggleLocalVideo()),
    onOpenScreenShareDialog: sources => dispatch(openScreenShareDialog(sources)),
    onStopSharing: () => dispatch(stopScreenSharing()),
  };
}

PresenterToolbar.propTypes = {
  isMicEnabled: bool,
  isVideoEnabled: bool,
  onToggleAudio: func.isRequired,
  onToggleVideo: func.isRequired,
  onOpenScreenShareDialog: func.isRequired,
  onStopSharing: func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToState)(PresenterToolbar);
