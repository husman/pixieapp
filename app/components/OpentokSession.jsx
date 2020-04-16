import React from 'react';
import {
  func,
  bool,
  instanceOf,
  string,
} from 'prop-types';
import { connect } from 'react-redux';
import {
  OTSession,
  OTPublisher,
  OTStreams,
  OTSubscriber,
} from 'opentok-react';
import {
  toggleLocalVideo,
  addRemoteVideo,
  remoteAudioChanged,
  remoteVideoChanged,
  setScreenShareStream,
  streamDestroyed,
} from '../actions/video';

function OpentokSession({
  apiKey,
  sessionId,
  token,
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
    <OTSession
      apiKey={apiKey}
      sessionId={sessionId}
      token={token}
      eventHandlers={{
        streamPropertyChanged: ({ changedProperty, newValue, stream: { id } }) => {
          switch (changedProperty) {
            case 'hasVideo':
              onRemoteVideoChanged(id, newValue);
              break;
            case 'hasAudio':
              onRemoteAudioChanged(id, newValue);
              break;
            default:
          }
        },
        streamDestroyed: onStreamDestroyed,
      }}
    >
      <OTPublisher
        properties={{
          publishAudio: isMicEnabled,
          publishVideo: isVideoEnabled,
          insertDefaultUI: false,
          ...(!isVideoEnabled ? { videoSource: null } : {}),
        }}
      />
      {isScreenSharing && screenShareSource && (
        <OTPublisher
          properties={{
            audioSource: null,
            publishAudio: false,
            videoSource: screenShareSource,
            insertDefaultUI: false,
          }}
        />
      ) || null}
      <OTStreams>
        <OTSubscriber
          properties={{
            insertDefaultUI: false,
          }}
          eventHandlers={{
            videoElementCreated: ({
              target: {
                stream: {
                  id: streamId,
                  hasVideo,
                  hasAudio,
                  videoType,
                },
              },
              element: {
                srcObject,
              },
            }) => {
              if (videoType === 'custom') {
                onSetScreenShareStream(srcObject, streamId);
              } else {
                onAddRemoteVideo({
                  streamId,
                  hasAudio,
                  hasVideo,
                  srcObject,
                });
              }
            },
          }}
        />
      </OTStreams>
    </OTSession>
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
      sessionId,
      apiKey,
      token,
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
    sessionId,
    apiKey,
    token,
  };
}

function mapDispatchToState(dispatch) {
  return {
    onAddRemoteVideo: value => dispatch(addRemoteVideo(value)),
    onRemoteAudioChanged: (streamId, value) => dispatch(remoteAudioChanged(streamId, value)),
    onRemoteVideoChanged: (streamId, value) => dispatch(remoteVideoChanged(streamId, value)),
    onSetScreenShareStream: (stream, streamId) => dispatch(setScreenShareStream(stream, streamId)),
    onStreamDestroyed: event => dispatch(streamDestroyed(event)),
  };
}

OpentokSession.propTypes = {
  isMicEnabled: bool,
  isVideoEnabled: bool,
  screenShareSource: instanceOf(MediaStreamTrack),
  isScreenSharing: bool,
  onAddRemoteVideo: func.isRequired,
  onRemoteAudioChanged: func.isRequired,
  onRemoteVideoChanged: func.isRequired,
  onSetScreenShareStream: func.isRequired,
  onStreamDestroyed: func.isRequired,
  sessionId: string.isRequired,
  apiKey: string.isRequired,
  token: string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToState)(OpentokSession);
