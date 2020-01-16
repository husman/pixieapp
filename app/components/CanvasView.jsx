import React from 'react';
import { connect } from 'react-redux';
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

function CanvasView() {
  return (
    <React.Fragment>
      <StyledVideoContainer>
        <CanvasToolbar />
        <Canvas />
      </StyledVideoContainer>
      <CanvasUserVideosView />
    </React.Fragment>
  );
}

function mapStateToProps() {
  return {};
}

function mapDispatchToState() {
  return {};
}

CanvasView.propTypes = {};

export default connect(mapStateToProps, mapDispatchToState)(CanvasView);
