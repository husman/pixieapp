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
  width: 100vw;
  height: 70vh;
`;
const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 3px;
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
  mode,
  screenShareStream,
}) {
  const initScreenShareVideo = useCallback((video) => {
    if (video) {
      video.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  return (
    <React.Fragment>
      {screenShareStream && (
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
      )}
      <UserVideosView mode={mode} />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  const {
    view: {
      mode,
      screenShareStream,
    },
  } = state;

  return {
    mode,
    screenShareStream,
  };
}

function mapDispatchToState(dispatch) {
  return {
    onStartScreenSharing: stream => dispatch(startScreenSharing(stream)),
  };
}

ScreenShareView.propTypes = {
  screenShareStream: instanceOf(MediaStream),
};

export default connect(mapStateToProps, mapDispatchToState)(ScreenShareView);