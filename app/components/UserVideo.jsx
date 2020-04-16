import React, { useCallback } from 'react';
import {
  bool,
  instanceOf,
} from 'prop-types';
import styled from 'styled-components';

const StyledUserVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

function UserVideo({
  muted,
  stream,
}) {
  const initVideo = useCallback((ref) => {
    if (ref && stream) {
      ref.srcObject = stream;
    }
  }, [stream]);

  return (
    <StyledUserVideo
      autoPlay
      muted={muted}
      ref={initVideo}
    />
  );
}

UserVideo.defaultProps = {
  muted: false,
};

UserVideo.propTypes = {
  muted: bool,
  stream: instanceOf(MediaStream).isRequired,
};

export default UserVideo;
