import React, { useCallback } from 'react';
import {
  instanceOf,
} from 'prop-types';
import styled from 'styled-components';

const StyledUserAudio = styled.audio`
  display: none;
`;

function UserAudio({
  stream,
}) {
  const initAudio = useCallback((ref) => {
    if (ref && stream) {
      ref.srcObject = stream;
    }
  }, [stream]);

  return (
    <StyledUserAudio
      autoPlay
      ref={initAudio}
    />
  );
}

UserAudio.propTypes = {
  stream: instanceOf(MediaStream).isRequired,
};

export default UserAudio;
