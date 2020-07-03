import React, { useCallback } from 'react';
import { instanceOf } from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import UserVideosView from './UserVideosView';
import { startScreenSharing } from '../actions/video';

const StyledVideoContainer = styled.div`
  flex: 1;
  text-align: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;
const StyledVideo = styled.video`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;
const StyledPresenterLabelContainer = styled.div`
  position: relative;
  z-index: 1;
`;
const StyledPresenterLabel = styled.div`
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
`;

function ScreenShareView({
  screenShareStream,
}) {
  const initScreenShareVideo = useCallback((video) => {
    if (video) {
      video.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  if (!screenShareStream) {
    return null;
  }

  return (
    <React.Fragment>
      <StyledPresenterLabelContainer className="video-mode-presenter-label">
        <StyledPresenterLabel>
          Remote
        </StyledPresenterLabel>
      </StyledPresenterLabelContainer>
      <StyledVideoContainer>
        <StyledVideo
          autoPlay
          ref={initScreenShareVideo}
        >
          Your device does not support videos.
        </StyledVideo>
      </StyledVideoContainer>
    </React.Fragment>
  );
}

function mapDispatchToState(dispatch) {
  return {
    onStartScreenSharing: stream => dispatch(startScreenSharing(stream)),
  };
}

ScreenShareView.propTypes = {
  screenShareStream: instanceOf(MediaStream),
};

export default connect(null, mapDispatchToState)(ScreenShareView);
