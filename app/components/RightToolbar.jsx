import React from 'react';
import { func, number } from 'prop-types';
import { connect } from 'react-redux';
import { FormattedNumber } from 'react-intl';
import styled from 'styled-components';
import { Icon } from './Icon';
import {
  openChatPanel,
  openParticipantsPanel,
  openAddPanel,
} from '../actions/view';
import { APP_VIEW_CANVAS } from '../constants/app';

const StyledRelativeContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const StyledContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 50px;
`;

const StyledPeopleIconContainer = styled.div`
  margin-bottom: 15px;
  cursor: pointer;
`;

const StyledChatIconContainer = styled.div`
  position: relative;
  cursor: pointer;
  margin-bottom: 15px;
`;

const StyledAddToCanvasIconContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const StyledBadgeContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: -5px;
  transform: translateX(-35%);
`;

function RightToolbar({
  chatAlertCount,
  mode,
  onOpenChatPanel,
  onOpenParticipantsPanel,
  onOpenAddPanel,
}) {
  return (
    <StyledRelativeContainer>
      <StyledContainer>
        <StyledPeopleIconContainer>
          <Icon
            type="two-people"
            color="white"
            backgroundColor="#0177B5"
            padding={10}
            onClick={onOpenParticipantsPanel}
          />
        </StyledPeopleIconContainer>
        <StyledChatIconContainer onClick={onOpenChatPanel}>
          {chatAlertCount > 0 && (
            <StyledBadgeContainer>
              <div className="square-box">
                <div className="square-content">
                  <FormattedNumber value={chatAlertCount} />
                </div>
              </div>
            </StyledBadgeContainer>
          )}
          <Icon
            type="chat"
            color="white"
            backgroundColor="#53bef6"
            padding={10}
          />
        </StyledChatIconContainer>
        {mode === APP_VIEW_CANVAS && (
          <StyledAddToCanvasIconContainer onClick={onOpenAddPanel}>
            {chatAlertCount > 0 && (
              <StyledBadgeContainer>
                <div className="square-box">
                  <div className="square-content">
                    <FormattedNumber value={chatAlertCount} />
                  </div>
                </div>
              </StyledBadgeContainer>
            )}
            <Icon
              type="add-to-canvas"
              color="white"
              backgroundColor="#ff0000"
              padding={10}
            />
          </StyledAddToCanvasIconContainer>
        )}
      </StyledContainer>
    </StyledRelativeContainer>
  );
}

RightToolbar.propTypes = {
  onOpenChatPanel: func.isRequired,
  onOpenParticipantsPanel: func.isRequired,
  chatAlertCount: number.isRequired,
};

function mapStateToProps(state) {
  const {
    view: {
      chatAlertCount,
      mode,
    },
  } = state;

  return {
    chatAlertCount,
    mode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onOpenChatPanel: () => dispatch(openChatPanel()),
    onOpenParticipantsPanel: () => dispatch(openParticipantsPanel()),
    onOpenAddPanel: () => dispatch(openAddPanel()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RightToolbar);
