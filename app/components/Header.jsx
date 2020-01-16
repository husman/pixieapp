import React from 'react';
import styled from 'styled-components';
import Logo from './Logo';
import ModeButtons from './ModeButtons';
import ProfileButtons from './ProfileButtons';

const StyledContainer = styled.div``;

const StyledHeader = styled.div`
  background-color: #EBF0F6;
  color: #626262;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: inset 0 -1px 1px -1px #000000;
  padding: 5px 0;
`;


function Header() {
  return (
    <StyledContainer>
      <StyledHeader>
        <Logo />
        <ModeButtons />
        <ProfileButtons />
      </StyledHeader>
    </StyledContainer>
  );
}

export default Header;
