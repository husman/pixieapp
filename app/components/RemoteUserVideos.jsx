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
import Grid from '@material-ui/core/Grid';
import UserVideo from './UserVideo';
import UserAudio from './UserAudio';
import VideoControls from './VideoControls';

const StyledUserVideoContainer = styled.div`
  position: relative;

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

function RemoteUserVideos({
  mode,
  remoteStreams,
}) {
  return (
    <Grid
      container
      spacing={3}
      style={{
        padding: '0 15px',
      }}
    >
      {remoteStreams.map(({
        hasAudio,
        hasVideo,
        srcObject,
        type,
      }) => {
        if (srcObject && type === 'video') {
          return (
            <Grid item xs={6} key={srcObject.id}>
              <StyledUserVideoContainer mode={mode}>
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
            </Grid>
          );
        }

        if (srcObject && type === 'audio') {
         return (
           <UserAudio stream={srcObject} key={srcObject.id} />
         );
        }
      })}
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
      mode,
      remoteStreams,
    },
  } = state;

  return {
    mode,
    remoteStreams,
  };
}

RemoteUserVideos.propTypes = {
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

export default connect(mapStateToProps)(RemoteUserVideos);
