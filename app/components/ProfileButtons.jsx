import React, { useState, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import IconButton from './IconButton';
import { Icon } from './Icon';
import ProfileMenu from './ProfileMenu';

const StyledContainer = styled.div`
  padding: 0 15px;
  position: relative;
`;

function ProfileButtons() {
  const [isMenuOpened, setMenuOpened] = useState(false);
  const onToggleMenu = useCallback(() => setMenuOpened(!isMenuOpened), [isMenuOpened, setMenuOpened]);

  return (
    <StyledContainer onClick={onToggleMenu}>
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
      {isMenuOpened && <ProfileMenu />}
    </StyledContainer>
  );
}

export default ProfileButtons;
