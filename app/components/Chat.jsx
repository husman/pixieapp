import React, { useEffect, useRef } from 'react';
import {
  func,
  bool,
  arrayOf,
  shape,
  string,
  instanceOf,
} from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ChatHeader from './ChatHeader';
import ChatTextfield from './ChatTextfield';
import ChatBody from './ChatBody';
import ParticipantsBody from './ParticipantsBody';
import { sendChatText } from '../actions/chat';

const StyledContainer = styled.div`
  position: absolute;
  width: 300px;
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
}) {
  return (
    <StyledContainer>
      <StyledColumnFlexBox>
        <ChatHeader />
        {isChatPanelOpened && <ChatBody />}
        {isParticipantsPanelOpened && <ParticipantsBody />}
      </StyledColumnFlexBox>
    </StyledContainer>
  );
}

Chat.propTypes = {
  isChatPanelOpened: bool,
  isParticipantsPanelOpened: bool,
};


function mapStateToProps(state) {
  const {
    view: {
      isChatPanelOpened,
      isParticipantsPanelOpened,
    },
  } = state;

  return {
    isChatPanelOpened,
    isParticipantsPanelOpened,
  };
}

export default connect(mapStateToProps, null)(Chat);
