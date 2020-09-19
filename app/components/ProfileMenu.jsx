import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { remote } from 'electron';
import { signOut } from '../actions/user';

const { app } = remote;

const ProfileMenuContainer = styled.div`
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  width: 200px;
  background-color: #EBF0F6;
  position: absolute;
  border-radius: 2px;
  top: 65px;
  right: 10px;

  :after {
    content: " ";
    position: absolute;
    right: 33px;
    top: -15px;
    border-top: none;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
    border-bottom: 15px solid #EBF0F6;
}
`;

const ProfileList = styled.ul`
  list-style: none;
  text-align: center;
  margin: 5px;
  padding: 0;
`;

const ProfileListItem = styled.li`
`;

const ProfileListItemLink = styled.a`
  display: block;
  padding: 7px 0;
  text-decoration: none;
  cursor: pointer;
  color: #2D2D2D;

  :hover {
    background-color: #0177B5;
    color: white;
  }
`;

function ProfileMenu({
  onSignOut,
}) {
  return (
    <ProfileMenuContainer>
      <ProfileList>
        <ProfileListItem>
          <ProfileListItemLink onClick={onSignOut}>
            Sign Out
          </ProfileListItemLink>
        </ProfileListItem>
        <ProfileListItem>
          {app.getVersion()}
        </ProfileListItem>
      </ProfileList>
    </ProfileMenuContainer>
  );
}

function mapDispatchToState(dispatch) {
  return {
    onSignOut: () => dispatch(signOut()),
  };
}

export default connect(null, mapDispatchToState)(ProfileMenu);
