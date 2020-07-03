import React from 'react';
import styled from 'styled-components';
import CanvasUserVideosView from './CanvasUserVideosView';
import Canvas from './Canvas';
import CanvasToolbar from './CanvasToolbar';

const StyledVideoContainer = styled.div`
  flex: 1;
  text-align: center;
  overflow: hidden;
  width: 100%;
`;

let hasBeenMounted = false;

function CanvasView({
  isMounted,
}) {
  hasBeenMounted = hasBeenMounted || isMounted;

  return (
    <React.Fragment>
      <StyledVideoContainer style={{ display: isMounted ? null : 'none' }}>
        {hasBeenMounted ? (
          <React.Fragment>
            <CanvasToolbar />
            <Canvas />
          </React.Fragment>
        ) : null}
      </StyledVideoContainer>
      <CanvasUserVideosView />
    </React.Fragment>
  );
}

export default CanvasView;
