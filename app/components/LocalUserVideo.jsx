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

function LocalUserVideo({
  localVideo,
}) {
  return (
    <StyledUserVideoContainer>
      {localVideo && (
        <UserVideo muted stream={localVideo} />
      )}
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
