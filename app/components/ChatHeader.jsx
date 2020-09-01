import React from 'react';
import {
  bool,
  func,
  number,
} from 'prop-types';
import {
  injectIntl,
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconButton from './IconButton';
import { Icon } from './Icon';
import CloseIcon from '../svgs/close.svg';
import {
  closeRightPanel,
  openChatPanel,
  openParticipantsPanel,
  openAddPanel,
} from '../actions/view';
import { APP_VIEW_CANVAS } from '../constants/app';

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: -1px 1px 4px rgba(0, 0, 0, 0.1);
`;

const StyledIconContainer = styled.div`
  flex: 1;
  text-align: center;
  padding: 15px;
  border-bottom: 3px solid ${({ active }) => active ? '#0177B5' : '#cccccc'};
  position: relative;
`;

const StyledCloseButton = styled.div`
  position: absolute;
  left: -25px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
`;

const StyledBadgeContainer = styled.div`
  display: inline-block;
  color: #f68535;
  margin-left: 5px;
`;

function ChatHeader({
  chatAlertCount,
  isChatPanelOpened,
  isParticipantsPanelOpened,
  isAddPanelOpened,
  onCloseRightPanel,
  onOpenChatPanel,
  onOpenParticipantsPanel,
  onOpenAddPanel,
  mode,
}) {
  return (
    <StyledContainer>
      <StyledCloseButton>
        <CloseIcon
          width="50"
          height="50"
          onClick={onCloseRightPanel}
        />
      </StyledCloseButton>
      <StyledIconContainer
        onClick={onOpenChatPanel}
        active={isChatPanelOpened}
      >
        <IconButton
          active={isChatPanelOpened}
          icon={<Icon type="chat" />}
        >
          <FormattedMessage
            id="panel.tab.chat.label"
            defaultMessage="Chat"
          />
        </IconButton>
        {chatAlertCount > 0 && (
          <StyledBadgeContainer>
            (
            <FormattedNumber value={chatAlertCount} />
            )
          </StyledBadgeContainer>
        )}
      </StyledIconContainer>
      <StyledIconContainer
        onClick={onOpenParticipantsPanel}
        active={isParticipantsPanelOpened}
      >
        <IconButton
          active={isParticipantsPanelOpened}
          icon={<Icon type="two-people" />}
        >
          <FormattedMessage
            id="panel.tab.participants.label"
            defaultMessage="Participants"
          />
        </IconButton>
      </StyledIconContainer>
      {mode === APP_VIEW_CANVAS && (
        <StyledIconContainer
          onClick={onOpenAddPanel}
          active={isAddPanelOpened}
        >
          <IconButton
            active={isAddPanelOpened}
            icon={<Icon type="add-to-canvas" />}
          >
            <FormattedMessage
              id="panel.tab.add.label"
              defaultMessage="Add"
            />
          </IconButton>
        </StyledIconContainer>
      )}
    </StyledContainer>
  );
}

ChatHeader.defaultProps = {
  isChatPanelOpened: true,
  isParticipantsPanelOpened: false,
};

ChatHeader.propTypes = {
  chatAlertCount: number.isRequired,
  isChatPanelOpened: bool,
  isParticipantsPanelOpened: bool,
  onCloseRightPanel: func.isRequired,
  onOpenChatPanel: func.isRequired,
  onOpenParticipantsPanel: func.isRequired,
};

function mapStateToProps(state) {
  const {
    view: {
      chatAlertCount,
      isChatPanelOpened,
      isParticipantsPanelOpened,
      isAddPanelOpened,
      mode,
    },
  } = state;

  return {
    chatAlertCount,
    isChatPanelOpened,
    isParticipantsPanelOpened,
    isAddPanelOpened,
    mode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCloseRightPanel: () => dispatch(closeRightPanel()),
    onOpenChatPanel: () => dispatch(openChatPanel()),
    onOpenParticipantsPanel: () => dispatch(openParticipantsPanel()),
    onOpenAddPanel: () => dispatch(openAddPanel()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(ChatHeader));
