import React from 'react';
import { bool, func } from 'prop-types';
import styled from 'styled-components';
import { Icon } from './Icon';

const StyledLink = styled.a`
  margin-left: 10px;
`;

function VideoControls({
  hasAudio,
  hasVideo,
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
}) {
  const toggleAudio = () => {
    if (!hasAudio) {
      return;
    }

    if (audioEnabled && onToggleAudio) {
      onToggleAudio();
    }
  };

  const toggleVideo = () => {
    if (!hasVideo) {
      return;
    }

    if (videoEnabled && onToggleVideo) {
      onToggleVideo();
    }
  };

  return (
    <React.Fragment>
      {hasVideo && (
        <StyledLink onClick={toggleVideo}>
          <Icon
            type={videoEnabled ? 'video' : 'video-off'}
            color={videoEnabled ? 'black' : 'white'}
            background={videoEnabled ? 'rgba(255,255,255,0.8)' : 'rgba(233, 101, 101, 0.8)'}
            border={2}
            padding={5}
            boxShadow="0px 2px 3px rgba(0, 0, 0, 0.25)"
          />
        </StyledLink>
      )}
      {hasAudio && (
        <StyledLink onClick={toggleAudio}>
          <Icon
            type={audioEnabled ? 'mic' : 'mic-off'}
            color={audioEnabled ? 'black' : 'white'}
            background={audioEnabled ? 'rgba(255,255,255,0.8)' : '#E96565'}
            borderColor="#E96565"
            border={2}
            padding={5}
            boxShadow="0px 2px 3px rgba(0, 0, 0, 0.25)"
          />
        </StyledLink>
      )}
    </React.Fragment>
  );
}

VideoControls.defaultProps = {
  hasAudio: true,
  hasVideo: true,
  audioEnabled: true,
  videoEnabled: true,
  onToggleAudio: null,
  onToggleVideo: null,
};


VideoControls.propTypes = {
  hasAudio: bool,
  hasVideo: bool,
  audioEnabled: bool,
  videoEnabled: bool,
  onToggleAudio: func,
  onToggleVideo: func,
};

export default VideoControls;
