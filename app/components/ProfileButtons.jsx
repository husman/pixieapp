import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import IconButton from './IconButton';
import { Icon } from './Icon';

const StyledContainer = styled.div`
  padding: 0 15px;
`;

function ProfileButtons() {
  return (
    <StyledContainer>
      <IconButton
        icon={<Icon type="caret-down" />}
        marginRight={8}
        labelAlign="left"
        fontSize="0.9em"
      >
        <FormattedMessage
          id="button.myProfile"
          defaultMessage="My Profile"
        />
      </IconButton>
      <Icon
        type="single-person"
        color="#828282"
        backgroundColor="#C4C4C4"
        padding={8}
      />
    </StyledContainer>
  );
}

export default ProfileButtons;
