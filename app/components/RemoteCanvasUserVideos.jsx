import React from 'react';
import {
  arrayOf,
  shape,
  instanceOf,
  string,
  number,
} from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import UserVideo from './UserVideo';

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
  return remoteStreams
    .map(({
      stream,
    }) => (
      <StyledUserVideoContainer key={stream.id} mode={mode}>
        <UserVideo stream={stream} />
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
    },
    user: {
      firstName,
    },
  } = state;

  return {
    mode,
    firstName,
  };
}

RemoteCanvasUserVideos.propTypes = {
  firstName: string.isRequired,
  remoteStreams: arrayOf(
    shape({
      stream: instanceOf(MediaStream),
    })
  ).isRequired,
  mode: number.isRequired,
};

export default connect(mapStateToProps)(RemoteCanvasUserVideos);
