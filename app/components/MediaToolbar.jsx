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
import { APP_VIEW_CANVAS } from '../constants/app';
import { signOut } from '../actions/user';

function MediaToolbar({
  isMicEnabled,
  isVideoEnabled,
  localVideo,
  isCanvasModeWithVideoActive,
  onToggleAudio,
  onToggleVideo,
  onOpenScreenShareDialog,
  onSignOut,
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
      <StyledMediaToolbarContainer
        isCanvasModeWithVideoActive={isCanvasModeWithVideoActive}
        className="media-toolbar"
      >
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
        <a onClick={onOpenDialog}>
          <Icon
            type="share"
            color="white"
            borderColor="white"
            border={2}
            marginRight={15}
            padding={10}
          />
        </a>
        <StyledVerticalBar />
        <Icon
          type="phone-off"
          color="white"
          backgroundColor="#e96565"
          borderColor="#e96565"
          border={2}
          marginLeft={15}
          padding={10}
          onClick={onSignOut}
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
      remoteStreams,
      mode,
    },
  } = state;
  const streams = remoteStreams.filter(({ hasVideo }) => hasVideo);
  const isCanvasModeWithVideoActive = mode === APP_VIEW_CANVAS && streams.length > 0;

  return {
    isVideoEnabled,
    isMicEnabled,
    isScreenSharing,
    localVideo,
    isCanvasModeWithVideoActive,
  };
}

function mapDispatchToState(dispatch) {
  return {
    onToggleAudio: () => dispatch(toggleLocalAudio()),
    onToggleVideo: () => dispatch(toggleLocalVideo()),
    onOpenScreenShareDialog: sources => dispatch(openScreenShareDialog(sources)),
    onSignOut: () => dispatch(signOut()),
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
