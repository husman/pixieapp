import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import IconButton from './IconButton';
import { Icon } from './Icon';

const StyledFlexContainer = styled.div`
  display: flex;
  align-items: stretch;
`;

const StyledButtonContainer = styled.div`
  padding: 10px 15px;
  border-bottom: ${({ active }) => active ? '3px solid #0177B5' : 0};
`;

function ModeButton() {
  return (
    <div>
      <StyledFlexContainer>
        <StyledButtonContainer>
          <IconButton
            icon={(
              <Icon
                type="paper"
                fontSize={1.3}
              />
            )}
            fontSize="0.85em"
          >
            <FormattedMessage
              id="button.mode.canvas"
              defaultMessage="Canvas"
            />
          </IconButton>
        </StyledButtonContainer>
        <StyledButtonContainer active>
          <IconButton
            active
            icon={(
              <Icon
                type="video"
                fontSize={1.3}
              />
            )}
            fontSize="0.85em"
          >
            <FormattedMessage
              id="button.mode.video"
              defaultMessage="Video"
            />
          </IconButton>
        </StyledButtonContainer>
        <StyledButtonContainer>
          <IconButton
            icon={(
              <Icon
                type="notebook-entry"
                fontSize={1.3}
              />
            )}
            fontSize="0.85em"
          >
            <FormattedMessage
              id="button.mode.notebook"
              defaultMessage="Notebook"
            />
          </IconButton>
        </StyledButtonContainer>
      </StyledFlexContainer>
    </div>
  );
}


export default ModeButton;
