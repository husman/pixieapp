import React from 'react';
import styled from 'styled-components';
import RemoteUserVideos from './RemoteUserVideos';
import { APP_VIEW_SCREEN_SHARE } from '../constants/app';

const StyledContainer = styled.div`
  text-align: center;
  height: ${({ mode }) => mode === APP_VIEW_SCREEN_SHARE ? '100px' : '100vh'};
  overflow-y: auto;
  position: relative;
  margin: 15px 0 15px 15px;
`;

const StyledVideoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
`;

function UserVideosView({ mode }) {
  return (
    <StyledContainer mode={mode}>
      <StyledVideoContainer>
        <RemoteUserVideos />
      </StyledVideoContainer>
    </StyledContainer>
  );
}

export default UserVideosView;
