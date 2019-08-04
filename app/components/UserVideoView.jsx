import React from 'react';
import styled from 'styled-components';
import RemoteUserVideo from './RemoteUserVideo';

const StyledContainer = styled.div`
  text-align: center;
  height: 100%;
  overflow-y: auto;
  position: relative;
`;

const StyledVideoContainer = styled.div`
  display: flex;
  height: 100%;
`;

function UserVideoView() {
  return (
    <StyledContainer>
      <StyledVideoContainer>
        <RemoteUserVideo />
      </StyledVideoContainer>
    </StyledContainer>
  );
}

export default UserVideoView;
