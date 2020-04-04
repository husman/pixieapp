import React, { useEffect, useState, useCallback } from 'react';
import {
  bool,
  arrayOf,
  shape,
  instanceOf,
  string,
} from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import UserVideo from './UserVideo';
import VideoControls from './VideoControls';
import PlaceholderIcon from '../svgs/user-video-placeholder.svg';

const StyledUserVideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  
  :hover {
    .video-controls {
      display: block;
    }
  }
`;

const MultiUserVideoContainer = styled(StyledUserVideoContainer)`
  padding-left: 15px;
  padding-right: ${({ paddingRight }) => paddingRight ? '15px' : '0'};
`;

const PlacehonderContainer = styled(StyledUserVideoContainer)`
  background-color: #757575;
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
  if (remoteStreams.length === 0) {
    return (
      <PlacehonderContainer>
        <PlaceholderIcon height="100%" />
      </PlacehonderContainer>
    );
  }

  if (remoteStreams.length === 1) {
    return remoteStreams.map(({
      streamId,
      hasAudio,
      srcObject,
    }) => (
      <StyledUserVideoContainer key={streamId}>
        {!hasAudio && (
          <StyledVideoControls className="video-controls">
            <VideoControls hasVideo={false} audioEnabled={hasAudio} />
          </StyledVideoControls>
        )}
        <UserVideo stream={srcObject} />
        <StyledVideoLabel>
          Remote
        </StyledVideoLabel>
      </StyledUserVideoContainer>
    ));
  }

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
    >
      {remoteStreams.map(({
        streamId,
        hasAudio,
        srcObject,
      }, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          container
        >
          <MultiUserVideoContainer key={streamId} paddingRight={index % 2 !== 0}>
            {!hasAudio && (
              <StyledVideoControls className="video-controls">
                <VideoControls hasVideo={false} audioEnabled={hasAudio} />
              </StyledVideoControls>
            )}
            <UserVideo stream={srcObject} />
            <StyledVideoLabel>
              Remote
            </StyledVideoLabel>
          </MultiUserVideoContainer>
        </Grid>
      ))}
    </Grid>
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
      remoteStreams,
    },
  } = state;

  return {
    remoteStreams: remoteStreams.filter(({ hasVideo }) => hasVideo),
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
