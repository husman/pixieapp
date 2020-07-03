import React from 'react';
import {
  func,
  bool,
  instanceOf,
} from 'prop-types';
import { connect } from 'react-redux';
import {
  addRemoteStream,
  remoteAudioChanged,
  remoteVideoChanged,
  setScreenShareStream,
  streamDestroyed,
} from '../actions/video';

function WebRtcSession({
  isMicEnabled,
  isVideoEnabled,
  isScreenSharing,
  screenShareSource,
  onAddRemoteVideo,
  onRemoteAudioChanged,
  onRemoteVideoChanged,
  onSetScreenShareStream,
  onStreamDestroyed,
}) {
  return (
    <div>
      {/* Display Screen share stream if it's available */}
      {/* Display user streams if they are available */}
      {/* Display user avatar streams if they are available */}
    </div>
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
      meetingId,
      mode,
      isMicEnabled,
      isVideoEnabled,
      localVideo,
      remoteStreams,
      isScreenSharing,
    },
    screenShare: {
      stream: screenShareSourceStream,
    },
  } = state;
  let screenShareSource;

  if (screenShareSourceStream) {
    const videoTracks = screenShareSourceStream.getVideoTracks();
    screenShareSource = videoTracks[0];
  }

  return {
    meetingId,
    mode,
    isMicEnabled,
    isVideoEnabled,
    localVideo,
    remoteStreams,
    isScreenSharing,
    screenShareSource,
  };
}

function mapDispatchToState(dispatch) {
  return {
    onAddRemoteVideo: value => dispatch(addRemoteStream(value)),
    onRemoteAudioChanged: (streamId, value) => dispatch(remoteAudioChanged(streamId, value)),
    onRemoteVideoChanged: (streamId, value) => dispatch(remoteVideoChanged(streamId, value)),
    onSetScreenShareStream: (stream, streamId) => dispatch(setScreenShareStream(stream, streamId)),
    onStreamDestroyed: event => dispatch(streamDestroyed(event)),
  };
}

WebRtcSession.propTypes = {
  isMicEnabled: bool,
  isVideoEnabled: bool,
  screenShareSource: instanceOf(MediaStreamTrack),
  isScreenSharing: bool,
  onAddRemoteVideo: func.isRequired,
  onRemoteAudioChanged: func.isRequired,
  onRemoteVideoChanged: func.isRequired,
  onSetScreenShareStream: func.isRequired,
  onStreamDestroyed: func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToState)(WebRtcSession);
