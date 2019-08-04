import React, { useState } from 'react';
import {
  func,
} from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { setUserInfo } from '../actions/user';

const StyledLabel = styled.div`
  color: white;
`;

function SignIn({
  onSetUserInfo,
}) {
  const [firstName, setFirstName] = useState('');
  return (
    <div>
      <StyledLabel>
        First name
      </StyledLabel>
      <input
        type="text"
        onChange={({ target: { value } }) => setFirstName(value)}
        value={firstName}
      />
      <div>
        <input
          type="button"
          value="Submit"
          onClick={() => onSetUserInfo({ firstName })}
          disabled={!firstName}
        />
      </div>
    </div>
  );
}

SignIn.propTypes = {
  onSetUserInfo: func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onSetUserInfo: ({ firstName, lastName }) => dispatch(setUserInfo({ firstName, lastName })),
  };
}

export default connect(null, mapDispatchToProps)(SignIn);
