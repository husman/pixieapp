import React from 'react';
import {
  instanceOf,
} from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import UserVideo from './UserVideo';

const StyledUserVideoContainer = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  display: inline-block;
  
  :hover {
    .video-controls {
      display: block;
    }
  }
`;

const StyledVideoLabel = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.6);
  z-index: 1;
`;

function LocalUserVideo({
  localVideo,
}) {
  return (
    <StyledUserVideoContainer>
      {localVideo && (
        <UserVideo muted stream={localVideo} />
      )}
      <StyledVideoLabel>
        Haleeq (You)
      </StyledVideoLabel>
    </StyledUserVideoContainer>
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
      localVideo,
    },
  } = state;

  return {
    localVideo,
  };
}

LocalUserVideo.propTypes = {
  localVideo: instanceOf(MediaStream),
};

export default connect(mapStateToProps)(LocalUserVideo);
