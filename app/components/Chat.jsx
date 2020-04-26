import React from 'react';
import {
  bool,
  number,
} from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ParticipantsBody from './ParticipantsBody';
import AddToCanvasBody from './AddToCanvasBody';
import { APP_VIEW_CANVAS } from '../constants/app';

const StyledContainer = styled.div`
  position: absolute;
  width: ${({ isCanvasMode }) => isCanvasMode ? '450' : '300'}px;
  top: 43px;
  right: 0;
  bottom: 0;
  background-color: white;
  box-shadow: -1px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: 2px 0px 0px 2px;
`;

const StyledColumnFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;


function Chat({
  isChatPanelOpened,
  isParticipantsPanelOpened,
  isAddPanelOpened,
  mode,
}) {
  const isCanvasMode = mode === APP_VIEW_CANVAS;

  return (
    <StyledContainer isCanvasMode={isCanvasMode}>
      <StyledColumnFlexBox>
        <ChatHeader />
        {isChatPanelOpened && <ChatBody />}
        {isParticipantsPanelOpened && <ParticipantsBody />}
        {isCanvasMode && isAddPanelOpened && <AddToCanvasBody />}
      </StyledColumnFlexBox>
    </StyledContainer>
  );
}

Chat.propTypes = {
  isChatPanelOpened: bool,
  isParticipantsPanelOpened: bool,
  isAddPanelOpened: bool,
  mode: number.isRequired,
};


function mapStateToProps(state) {
  const {
    view: {
      isChatPanelOpened,
      isParticipantsPanelOpened,
      isAddPanelOpened,
      mode,
    },
  } = state;

  return {
    isChatPanelOpened,
    isParticipantsPanelOpened,
    isAddPanelOpened,
    mode,
  };
}

export default connect(mapStateToProps, null)(Chat);
