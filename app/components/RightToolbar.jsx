import React from 'react';
import { func, number } from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Icon } from './Icon';
import {
  openChatPanel,
  openParticipantsPanel,
} from '../actions/view';
import { FormattedNumber } from 'react-intl';

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
`;

const StyledChatIconContainer = styled.div`
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
  onOpenChatPanel,
  onOpenParticipantsPanel,
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
    },
  } = state;

  return {
    chatAlertCount,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onOpenChatPanel: () => dispatch(openChatPanel()),
    onOpenParticipantsPanel: () => dispatch(openParticipantsPanel()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RightToolbar);
