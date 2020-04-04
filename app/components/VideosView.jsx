import React from 'react';
import { instanceOf, arrayOf } from 'prop-types';
import { connect } from 'react-redux';
import UserVideoView from './UserVideoView';
import UserVideosView from './UserVideosView';

function VideosView({
  remoteStreams,
}) {
  return (
    <UserVideoView />
  );
}

VideosView.propTypes = {
  remoteStreams: arrayOf(instanceOf(MediaStream)),
};

function mapStateToProps(state) {
  const {
    view: {
      remoteStreams,
    },
  } = state;

  return {
    remoteStreams,
  };
}

export default connect(mapStateToProps)(VideosView);
