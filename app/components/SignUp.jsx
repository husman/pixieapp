import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MLink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import Copyright from './Copyright';
import { showWelcomeView } from '../actions/view';
import { WELCOME_VIEW_SIGN_IN } from '../constants/app';
import styled from 'styled-components';
import { signUp } from '../actions/user';
import { Spinner, Toast } from './signIn.styles';

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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignUp({
  isSignUpLoading,
  signUpErrors,
  onSignIn,
  onSignUp,
}) {
  const classes = useStyles();

  // First name
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState(false);
  const onFirstNameChange = useCallback(({ target: { value } }) => {
    setFirstName(value);
    setFirstNameError(!value);
  }, [setFirstName, setFirstNameError]);

  // Last name
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState(false);
  const onLastNameChange = useCallback(({ target: { value } }) => {
    setLastName(value);
    setLastNameError(!value);
  }, [setLastName, setLastNameError]);

  // E-mail
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const onEmailChange = useCallback(({ target: { value } }) => {
    setEmail(value);
    setEmailError(!value);
  }, [setEmail, setEmailError]);

  // Password
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const onPasswordChange = useCallback(({ target: { value } }) => {
    setPassword(value);
    setPasswordError(!value);
  }, [setPassword, setPasswordError]);

  const onSignUpClick = useCallback(() => {
    setFirstNameError(!firstName);
    setLastNameError(!lastName);
    setEmailError(!email);
    setPasswordError(!password);

    if (firstName && lastName && email && password) {
      onSignUp({ firstName, lastName, email, password });
    }
  }, [
    onSignUp,
    firstName,
    lastName,
    email,
    password,
    setFirstNameError,
    setLastNameError,
    setEmailError,
    setPasswordError,
  ]);

  return (
    <StyledContainer component="main" maxWidth="xs">
      {signUpErrors && (
        <Toast severity="error">
          The e-mail address you have entered already exists.
        </Toast>
      )}
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography><br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              autoFocus
              fullWidth
              autoComplete="fname"
              variant="outlined"
              label="First Name"
              error={firstNameError}
              value={firstName}
              onChange={onFirstNameChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Last Name"
              autoComplete="lname"
              error={lastNameError}
              value={lastName}
              onChange={onLastNameChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Email Address"
              autoComplete="email"
              error={emailError}
              value={email}
              onChange={onEmailChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              autoComplete="current-password"
              error={passwordError}
              value={password}
              onChange={onPasswordChange}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={onSignUpClick}
        >
          {isSignUpLoading ? <Spinner size={24} /> : 'Sign up'}
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <Link variant="body2" onClick={onSignIn}>
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </StyledContainer>
  );
}

function mapStateToProps(state) {
  const {
    view: {
      isSignUpLoading,
      signUpErrors,
    },
  } = state;

  return {
    isSignUpLoading,
    signUpErrors,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSignIn: () => dispatch(showWelcomeView(WELCOME_VIEW_SIGN_IN)),
    onSignUp: data => dispatch(signUp(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
