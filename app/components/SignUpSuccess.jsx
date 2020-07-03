import React from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { showWelcomeView } from '../actions/view';
import { WELCOME_VIEW_SIGN_IN } from '../constants/app';

const StyledContainer = styled(Container)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CenteredContent = styled.div`
  text-align: center;
`;

function SignUpSuccess({
  onSignIn,
}) {
  return (
    <StyledContainer component="main" maxWidth="xs">
      <CenteredContent>
        <Typography component="h1" variant="h5">
          Account Successfully Created!
        </Typography>
      </CenteredContent>
      <br />
      <Alert severity="success">
        Your account has been successfully created.
        An e-mail has been sent to your e-mail address.
        Please check your inbox to verify your e-mail address.
      </Alert>
      <br /><br />
      <div>
        Once your have verified your e-mail address, then you can sign in.
      </div>
      <br />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={onSignIn}
      >
        Sign in
      </Button>
    </StyledContainer>
  );
}

SignUpSuccess.propTypes = {
  onSignIn: func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onSignIn: () => dispatch(showWelcomeView(WELCOME_VIEW_SIGN_IN)),
  };
}

export default connect(null, mapDispatchToProps)(SignUpSuccess);
