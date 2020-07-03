import React from 'react';
import { instanceOf } from 'prop-types';
import { connect } from 'react-redux';
import UserVideoView from './UserVideoView';
import ScreenShareView from './ScreenShareView';

function VideosView({
  screenShareStream,
}) {

  if (screenShareStream) {
    return <ScreenShareView screenShareStream={screenShareStream} />;
  }

  return <UserVideoView />;
}

function mapStateToProps(state) {
  const {
    view: {
      remoteStreams,
    },
  } = state;

  const {
    srcObject: screenShareStream = null,
  } = remoteStreams.find(({ type }) => type === 'screen') || {};

  return {
    screenShareStream,
  };
}

VideosView.propTypes = {
  screenShareStream: instanceOf(MediaStream),
};

export default connect(mapStateToProps)(VideosView);
