import React from 'react';
import {
  bool,
  arrayOf,
  shape,
  instanceOf,
  string,
  number,
} from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import UserVideo from './UserVideo';
import VideoControls from './VideoControls';
import PlaceholderIcon from '../svgs/user-video-placeholder.svg';

const StyledUserVideoContainer = styled.div`
  position: relative;
  width: 25%;
  height: 100%;
  margin-left: 10px;

  :hover {
    .video-controls {
      display: block;
    }
  }
`;

const StyledVideoControls = styled.div`
  display: none;
  padding: 10px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`;

const StyledVideoLabel = styled.div`
  padding: 10px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.6);
`;

function RemoteCanvasUserVideos({
  mode,
  remoteStreams,
  firstName,
}) {
  return remoteStreams.map(({
    streamId,
    srcObject,
  }) => (
    <StyledUserVideoContainer key={streamId} mode={mode}>
      <UserVideo stream={srcObject} />
      <StyledVideoLabel>
        {firstName}
      </StyledVideoLabel>
    </StyledUserVideoContainer>
  ));
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
      mode,
      remoteStreams,
    },
    user: {
      firstName,
    },
  } = state;

  return {
    mode,
    remoteStreams,
    firstName,
  };
}

RemoteCanvasUserVideos.propTypes = {
  firstName: string.isRequired,
  remoteStreams: arrayOf(
    shape({
      streamId: string,
      hasAudio: bool,
      hasVideo: bool,
      srcObject: instanceOf(MediaStream),
    }),
  ).isRequired,
  mode: number.isRequired,
};

export default connect(mapStateToProps)(RemoteCanvasUserVideos);
