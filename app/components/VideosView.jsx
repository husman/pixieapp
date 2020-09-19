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
      screenShareStream = null,
    },
  } = state;

  return {
    screenShareStream,
  };
}

VideosView.propTypes = {
  screenShareStream: instanceOf(MediaStream),
};

export default connect(mapStateToProps)(VideosView);
