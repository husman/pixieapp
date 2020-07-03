import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MLink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import styled from 'styled-components';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Copyright from './Copyright';
import { showWelcomeView } from '../actions/view';
import {
  WELCOME_JOIN_MEETING_VIEW,
  WELCOME_VIEW_SIGN_UP,
} from '../constants/app';
import {
  closeUserVerificationAlert,
  signIn,
} from '../actions/user';
import { Spinner, Toast } from './signIn.styles';
import store from '../lib/Store';
import axios from 'axios';

const Link = styled(MLink)`
  cursor: pointer;
`;

const StyledContainer = styled(Container)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const BlueSpinner = styled(Spinner)`
  color: #0074D9 !important;
`;

const FormLabel = styled(FormControlLabel)`
  align-self: flex-start;
`;

function SignIn({
  signInEmail,
  verified,
  signInErrors,
  isSignInLoading,
  isResendVerificationEmailLoading,
  showVerificationAlert,
  onCreateNewAccount,
  onJoinAsGuest,
  onSignIn,
  onHideVerificationAlert,
}) {
  const classes = useStyles();
  const [email, setEmail] = useState(signInEmail);
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [rememberMe, setRememberMe] = useState(store.get('signInRememberMe'));

  const onSignInClick = useCallback(() => {
    setEmailError(!email);
    setPasswordError(!password);

    if (email && password) {
      onSignIn(email, password, rememberMe);
    }
  }, [
    onSignIn,
    email,
    password,
    setEmailError,
    setPasswordError,
    rememberMe,
  ]);

  const onEmailChange = useCallback(({ target: { value } }) => {
    setEmailError(!value);
    setEmail(value);
  }, [setEmail, setEmailError]);

  const onPasswordChange = useCallback(({ target: { value } }) => {
    setPasswordError(!value);
    setPassword(value);
  }, [setPassword, setPasswordError]);

  const onRememberMeChange = useCallback(({ target: { checked } }) => {
    setRememberMe(checked);
  }, [setRememberMe]);

  const handleKeyPress = useCallback(({ key }) => {
    if (key === 'Enter') {
      onSignInClick()
    }
  }, [onSignInClick]);

  const onResendVerificationEmailClick = useCallback(async () => {
    await axios.post('http://pixie.neetos.com/resendVerification', {
      email,
    });
  }, [email]);

  useEffect(() => {
    if (showVerificationAlert) {
      setTimeout(onHideVerificationAlert, 10000);
    }
  }, [showVerificationAlert, onHideVerificationAlert]);

  return (
    <StyledContainer
      component="main"
      maxWidth="xs"
      onKeyPress={handleKeyPress}
    >
      {verified === 0 && showVerificationAlert ? (
        <Toast severity="error">
          Your verification e-mail as expired. Please request a new verification e-mail.
        </Toast>
      ) : null}
      {verified && showVerificationAlert ? (
        <Toast severity="success">
          Your e-mail address has been successfully verified.
        </Toast>
      ) : null}
      {verified === 0 ? (
        <Toast severity="warning">
          It looks like your e-mail hasn't been verified yet.
          <br />
          <Button
            color="primary"
            onClick={onResendVerificationEmailClick}
          >
            {isResendVerificationEmailLoading ? <BlueSpinner size={24} /> : 'Resend verification e-mail.'}
          </Button>
        </Toast>
      ) : null}
      {signInErrors && (
        <Toast severity="error">
          Incorrect e-mail/password combination.
        </Toast>
      )}
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <TextField
          autoFocus={!email}
          fullWidth
          required
          variant="outlined"
          margin="normal"
          label="Email Address"
          autoComplete="email"
          error={emailError}
          value={email}
          onChange={onEmailChange}
        />
        <TextField
          autoFocus={!!email}
          fullWidth
          required
          error={passwordError}
          variant="outlined"
          margin="normal"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={onPasswordChange}
        />
        <FormLabel
          control={
            <Checkbox
              checked={rememberMe}
              color="primary"
              onChange={onRememberMeChange}
            />
          }
          label="Remember me"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={onSignInClick}
        >
          {isSignInLoading ? <Spinner size={24} /> : 'Sign in'}
        </Button>
        <Grid container>
          <Grid item sm={5}>
            <Link onClick={onJoinAsGuest}>
              Join as guest
            </Link>
          </Grid>
          <Grid item sm={7} style={{ textAlign: 'right' }}>
            <Link variant="body2" onClick={onCreateNewAccount}>
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </StyledContainer>
  );
}

function mapStateToProps(state) {
  const {
    user: {
      showVerificationAlert,
    },
    view: {
      signInEmail,
      verified,
      isSignInLoading,
      signInErrors,
      isResendVerificationEmailLoading,
    },
  } = state;

  return {
    signInEmail,
    verified,
    showVerificationAlert,
    isSignInLoading,
    signInErrors,
    isResendVerificationEmailLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCreateNewAccount: () => dispatch(showWelcomeView(WELCOME_VIEW_SIGN_UP)),
    onJoinAsGuest: () => dispatch(showWelcomeView(WELCOME_JOIN_MEETING_VIEW, true)),
    onSignIn: (email, password, rememberMe) => dispatch(signIn({ email, password, rememberMe })),
    onHideVerificationAlert: () => dispatch(closeUserVerificationAlert()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
