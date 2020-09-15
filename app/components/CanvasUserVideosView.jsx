import React from 'react';
import styled from 'styled-components';
import RemoteCanvasUserVideos from './RemoteCanvasUserVideos';
import { connect } from 'react-redux';

const StyledContainer = styled.div`
  text-align: center;
  height: 180px;
  overflow: hidden;
  position: relative;
  padding: 5px 0 5px 5px;
`;

const StyledVideoContainer = styled.div`
  height: 100%;
  display: flex;
`;

function CanvasUserVideosView({
  remoteStreams,
}) {
  const remoteVideosEnabled = remoteStreams.length > 0;

  if (!remoteVideosEnabled) {
    return null;
  }

  return (
    <StyledContainer>
      <StyledVideoContainer>
        <RemoteCanvasUserVideos remoteStreams={remoteStreams} />
      </StyledVideoContainer>
    </StyledContainer>
  );
}

function mapStateToProps(state) {
  const {
    view: {
      remoteStreams,
    },
  } = state;

  return {
    remoteStreams: remoteStreams.filter(({
      stream,
    }) => {
      if (!stream) {
        return false;
      }

      const videoTracks = stream.getVideoTracks();

      return videoTracks && videoTracks.length > 0;
    }),
  };
}

export default connect(mapStateToProps)(CanvasUserVideosView);
