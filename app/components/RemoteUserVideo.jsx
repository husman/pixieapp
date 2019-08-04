import React from 'react';
import {
  bool,
  arrayOf,
  shape,
  instanceOf,
  string,
} from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import UserVideo from './UserVideo';
import VideoControls from './VideoControls';
import PlaceholderIcon from '../svgs/user-video-placeholder.svg';

const StyledUserVideoContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100%;
  
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
`;

const StyledVideoLabel = styled.div`
  padding: 10px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.6);
  z-index: 1;
`;

function RemoteUserVideo({
  remoteStreams,
}) {
  return remoteStreams.map(({
    streamId,
    hasAudio,
    hasVideo,
    srcObject,
  }) => (
    <StyledUserVideoContainer key={streamId}>
      {!hasAudio && (
        <StyledVideoControls className="video-controls">
          <VideoControls hasVideo={false} audioEnabled={hasAudio} />
        </StyledVideoControls>
      )}
      {hasVideo && (<UserVideo stream={srcObject} />)}
      {!hasVideo && (<PlaceholderIcon height="99.4%" />)}
      <StyledVideoLabel>
        Remote
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
      remoteStreams,
    },
  } = state;

  return {
    remoteStreams,
  };
}

RemoteUserVideo.propTypes = {
  remoteStreams: arrayOf(
    shape({
      streamId: string,
      hasAudio: bool,
      hasVideo: bool,
      srcObject: instanceOf(MediaStream),
    }),
  ).isRequired,
};

export default connect(mapStateToProps)(RemoteUserVideo);
