import React from 'react';
import {
  func,
  bool,
  arrayOf,
  shape,
  instanceOf,
  string,
} from 'prop-types';
import styled from 'styled-components';
import OpenTok from 'opentok';
import { connect } from 'react-redux';
import {
  OTSession,
  OTPublisher,
  OTStreams,
  OTSubscriber,
} from 'opentok-react';
import UserVideo from './UserVideo';
import {
  toggleLocalVideo,
  addRemoteStream,
  remoteAudioChanged,
  remoteVideoChanged,
  setScreenShareStream,
  streamDestroyed,
} from '../actions/video';
import VideoControls from './VideoControls';

const apiKey = '46003032';
const secret = '135571e6887919f56e5b7d48b0f6e8e9adc47da3';
const opentok = new OpenTok(apiKey, secret);
const sessionId = '1_MX40NjAwMzAzMn5-MTU2MzYzODIzMjA4N354TFh1MHlZc1prd3pML0dLT3M5QXIwckp-fg';
const token = opentok.generateToken(sessionId);

const StyledUserVideoLayout = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 15px;
  margin-bottom: 10px;
`;

const StyledUserVideoContainer = styled.div`
  margin-left: 15px;
  width: 240px
  height: 182px;
  position: relative;

  :hover {
    .video-controls {
      display: block;
    }
  }
`;

const StyledContainer = styled.div`
  overflow: hidden;
  height: 182px;
  margin-top: 15px;
  margin-bottom: 15px;
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
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.6);
  z-index: 1;
`;

const StyledVideoOffBackground = styled.img`
  height: 100%;
  max-width: 100%;
  max-height: 100%;
`;

function UserVideos({
  isMicEnabled,
  isVideoEnabled,
  localVideo,
  remoteStreams,
  isScreenSharing,
  screenShareSource,
  onAddRemoteVideo,
  onRemoteAudioChanged,
  onRemoteVideoChanged,
  onSetScreenShareStream,
  onStreamDestroyed,
}) {
  return (
    <StyledContainer>
      <StyledUserVideoLayout className="user-videos-layout">
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
        <StyledUserVideoContainer>
          {isVideoEnabled && localVideo && (
            <UserVideo stream={localVideo} />
          )}
          {!isVideoEnabled && (
            <StyledVideoOffBackground alt="Haleeq" src="images/video-off-bg.png" />
          )}
          <StyledVideoLabel>
            Haleeq
          </StyledVideoLabel>
        </StyledUserVideoContainer>
        {remoteStreams.map(({
          streamId,
          hasAudio,
          hasVideo,
          srcObject,
        }) => (
          <StyledUserVideoContainer key={streamId}>
            {!hasAudio && (
              <StyledVideoControls className="video-controls">
                <VideoControls hasVideo={false} audioEnabled={hasAudio} />
              </StyledVideoControls>
            )}
            {hasVideo && (<UserVideo stream={srcObject} />)}
            {!hasVideo && (<StyledVideoOffBackground alt="Haleeq" src="images/video-off-bg.png" />)}
            <StyledVideoLabel>
              Remote
            </StyledVideoLabel>
          </StyledUserVideoContainer>
        ))}
      </StyledUserVideoLayout>
    </StyledContainer>
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
    ontoggleLocalVideo: () => dispatch(toggleLocalVideo()),
    onAddRemoteVideo: value => dispatch(addRemoteStream(value)),
    onRemoteAudioChanged: (streamId, value) => dispatch(remoteAudioChanged(streamId, value)),
    onRemoteVideoChanged: (streamId, value) => dispatch(remoteVideoChanged(streamId, value)),
    onSetScreenShareStream: (stream, streamId) => dispatch(setScreenShareStream(stream, streamId)),
    onStreamDestroyed: event => dispatch(streamDestroyed(event)),
  };
}

UserVideos.propTypes = {
  isMicEnabled: bool,
  isVideoEnabled: bool,
  localVideo: instanceOf(MediaStream),
  screenShareSource: instanceOf(MediaStreamTrack),
  remoteStreams: arrayOf(
    shape({
      streamId: string,
      hasAudio: bool,
      hasVideo: bool,
      srcObject: instanceOf(MediaStream),
    }),
  ).isRequired,
  isScreenSharing: bool,
  onAddRemoteVideo: func.isRequired,
  onRemoteAudioChanged: func.isRequired,
  onRemoteVideoChanged: func.isRequired,
  onSetScreenShareStream: func.isRequired,
  onStreamDestroyed: func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToState)(UserVideos);
