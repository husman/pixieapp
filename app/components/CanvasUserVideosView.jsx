import React from 'react';
import styled from 'styled-components';
import RemoteUserVideos from './RemoteUserVideos';

const StyledContainer = styled.div`
  text-align: center;
  height: 100px;
  overflow: hidden;
  position: relative;
  padding: 5px 0 5px 5px;
`;

const StyledVideoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`;

function CanvasUserVideosView() {
  return (
    <StyledContainer>
      <StyledVideoContainer>
        <RemoteUserVideos />
      </StyledVideoContainer>
    </StyledContainer>
  );
}

export default CanvasUserVideosView;
