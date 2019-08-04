/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React, { useCallback } from 'react';
import {
  bool,
  func,
  instanceOf,
} from 'prop-types';
import { connect } from 'react-redux';
import { remote } from 'electron';
import {
  StyledMediaToolbarRoot,
  StyledMediaToolbarContainer,
  StyledVerticalBar,
} from './mediaToolbar.styles';
import { Icon } from './Icon';
import {
  toggleLocalAudio,
  toggleLocalVideo,
  openScreenShareDialog,
} from '../actions/video';
import { getSources } from '../utils/capture';

function terminateApp() {
  const windowManager = remote.require('electron-window-manager');
  windowManager.closeAll();
}

function MediaToolbar({
  isMicEnabled,
  isVideoEnabled,
  localVideo,
  onToggleAudio,
  onToggleVideo,
  onOpenScreenShareDialog,
}) {
  const onOpenDialog = useCallback(
    async () => onOpenScreenShareDialog(await getSources()),
    [onOpenScreenShareDialog],
  );

  const toggleVideo = useCallback(
    async () => {
      if (isVideoEnabled && localVideo) {
        localVideo.getVideoTracks()[0].stop();
      }

      onToggleVideo(!isVideoEnabled);
    },
    [isVideoEnabled],
  );

  return (
    <StyledMediaToolbarRoot>
      <StyledMediaToolbarContainer className="media-toolbar">
        <a onClick={onToggleAudio}>
          <Icon
            type={isMicEnabled ? 'mic' : 'mic-off'}
            color={isMicEnabled ? 'black' : 'white'}
            backgroundColor={isMicEnabled ? 'white' : 'transparent'}
            border={2}
            padding={10}
            marginRight={10}
          />
        </a>
        <a onClick={toggleVideo}>
          <Icon
            type={isVideoEnabled ? 'video' : 'video-off'}
            color={isVideoEnabled ? 'black' : 'white'}
            backgroundColor={isVideoEnabled ? 'white' : 'transparent'}
            border={2}
            borderColor="white"
            padding={10}
            marginRight={10}
          />
        </a>
        <Icon
          type="share"
          color="white"
          borderColor="white"
          border={2}
          marginRight={15}
          padding={10}
          onClick={onOpenDialog}
        />
        <StyledVerticalBar />
        <Icon
          type="phone-off"
          color="white"
          backgroundColor="#e96565"
          borderColor="#e96565"
          border={2}
          marginLeft={15}
          padding={10}
          onClick={terminateApp}
        />
      </StyledMediaToolbarContainer>
    </StyledMediaToolbarRoot>
  );
}

/**
 * Called when a new app's state changes
 *
 * @param {{}} state
 *
 * @return {{}} - The props to pass to the components
 */
function mapStateToProps(state) {
  const {
    view: {
      isVideoEnabled,
      isMicEnabled,
      isScreenSharing,
      localVideo,
    },
  } = state;

  return {
    isVideoEnabled,
    isMicEnabled,
    isScreenSharing,
    localVideo,
  };
}

function mapDispatchToState(dispatch) {
  return {
    onToggleAudio: () => dispatch(toggleLocalAudio()),
    onToggleVideo: async (isVideoEnabled) => {
      const { mediaDevices } = navigator;
      let stream = null;

      try {
        if (isVideoEnabled) {
          const constraints = {
            audio: false,
            video: true,
          };

          stream = await mediaDevices.getUserMedia(constraints);
        }

        dispatch(toggleLocalVideo(isVideoEnabled, stream));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Could not get media device to capture the screen', err);
      }
    },
    onOpenScreenShareDialog: sources => dispatch(openScreenShareDialog(sources)),
  };
}

MediaToolbar.propTypes = {
  isMicEnabled: bool.isRequired,
  isVideoEnabled: bool.isRequired,
  localVideo: instanceOf(MediaStream),
  onToggleAudio: func.isRequired,
  onToggleVideo: func.isRequired,
  onOpenScreenShareDialog: func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToState)(MediaToolbar);
