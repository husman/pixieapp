import React, { Fragment } from 'react';
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
  remoteVideoStreams,
}) {
  return (
    <Fragment>
      {remoteVideoStreams.length === 0 ? (
        <PlacehonderContainer>
          <PlaceholderIcon height="100%" />
        </PlacehonderContainer>
      ) : null}
      {remoteVideoStreams.length === 1 ? (
        remoteVideoStreams.map(({
            stream,
          }) => (
            <StyledUserVideoContainer key={stream.id}>
              {/*{!hasAudio && (*/}
              {/*  <StyledVideoControls className="video-controls">*/}
              {/*    <VideoControls hasVideo={false} audioEnabled={hasAudio} />*/}
              {/*  </StyledVideoControls>*/}
              {/*)}*/}
              <UserVideo stream={stream} />
              {/*<StyledVideoLabel>*/}
              {/*  Remote*/}
              {/*</StyledVideoLabel>*/}
            </StyledUserVideoContainer>
          ),
        )
      ) : null}
      {remoteVideoStreams.length > 1 ? (
        <Grid
          container
          justify="center"
          alignItems="center"
        >
          {remoteVideoStreams.map(({ stream }, index) => (
            <Grid
              key={stream.id}
              item
              xs={12}
              sm={6}
              container
            >
              <MultiUserVideoContainer paddingRight={index % 2 !== 0}>
                {/*{!hasAudio && (*/}
                {/*  <StyledVideoControls className="video-controls">*/}
                {/*    <VideoControls hasVideo={false} audioEnabled={hasAudio} />*/}
                {/*  </StyledVideoControls>*/}
                {/*)}*/}
                <UserVideo stream={stream} />
                {/*<StyledVideoLabel>*/}
                {/*  Remote*/}
                {/*</StyledVideoLabel>*/}
              </MultiUserVideoContainer>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Fragment>
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
    remoteVideoStreams: remoteStreams.filter(({
      isScreenShare,
      stream,
    }) => {
      if (!stream || isScreenShare) {
        return false;
      }

      const videoTracks = stream.getVideoTracks();

      return videoTracks && videoTracks.length > 0;
    }),
  };
}

RemoteUserVideo.defaultProps = {
  remoteVideoStreams: [],
};

RemoteUserVideo.propTypes = {
  remoteVideoStreams: arrayOf(
    shape({
      isScreenShare: bool,
      stream: instanceOf(MediaStream),
    }),
  ),
};

export default connect(mapStateToProps)(RemoteUserVideo);
