import React from 'react';
import { func } from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  toggleLocalAudio,
  toggleLocalVideo,
} from '../actions/video';

const OuterContainer = styled.div`
  display: inline-block;
  margin-top: 15px;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const IconContainer = styled.div`
  font-family: 'Pixie';
  border: 1px solid #999999;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  width: 60px;
  height: 60px;
  font-size: 2em;
  position: relative;
  cursor: pointer;
  background-color: ${props => props.enabled ? 'transparent' : '#ec9090'};
  transition: all 0.3s;

  :hover {
    background-color: ${props => props.enabled ? '#eeeeee' : '#cd7d7d'};
  }
`;

const IconElement = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const IconOuterContainer = styled.div`
  margin-left: ${props => props.marginLeft || 0};
`;

const IconLabel = styled.div`
  margin-top: 10px;
  font-size: 0.75em;
  font-weight: bold;
`;

function SignInAudioSettings({
  isMicEnabled,
  isVideoEnabled,
  onToggleMic,
  onToggleVideo,
}) {
  return (
    <OuterContainer>
      <InnerContainer>
        <IconOuterContainer onClick={onToggleMic}>
          <IconContainer enabled={isMicEnabled}>
            <IconElement className={isMicEnabled ? 'icon-mic' : 'icon-mic-off'} />
          </IconContainer>
          <IconLabel>
            Mic On
          </IconLabel>
        </IconOuterContainer>
        <IconOuterContainer
          marginLeft="25px"
          onClick={onToggleVideo}
        >
          <IconContainer enabled={isVideoEnabled}>
            <IconElement className={isVideoEnabled ? 'icon-video' : 'icon-video-off'} />
          </IconContainer>
          <IconLabel>
            Video Off
          </IconLabel>
        </IconOuterContainer>
      </InnerContainer>
    </OuterContainer>
  );
}

SignInAudioSettings.propTypes = {
  onToggleMic: func.isRequired,
  onToggleVideo: func.isRequired,
};

function mapStateToProps(state) {
  const {
    view: {
      isMicEnabled,
      isVideoEnabled,
    },
  } = state;

  return {
    isMicEnabled,
    isVideoEnabled,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onToggleMic: () => dispatch(toggleLocalAudio()),
    onToggleVideo: () => dispatch(toggleLocalVideo()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInAudioSettings);
