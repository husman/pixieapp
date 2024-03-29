import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';

const WelcomeHeading = styled.div`
  font-size: 1.44em;
  padding-top: 25px;
  font-weight: bold;
`;

const SectionLabel = styled.div`
  font-size: 1.2em;
  font-weight: bold;
`;

const SectionSubLabel = styled.div`
  font-size: 0.86em;
`;

const StyledContainer = styled(Container)`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const JoinButtonContainer = styled.div`
  margin-top: 35px;
`;

const ButtonContainer = styled.div`
  margin-top: 25px;
`;

const JoinButton = styled(Button)`
  background-color: #0177B5 !important;

  :hover {
    background-color: #015280 !important;
  }
`;

const LinkContainer = styled.div`
  margin-top: 18px;
`;

const Link = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: #0177B5;
  transition: all 0.3s;

  :hover {
    color: #015480;
  }
`;

const Spinner = styled(CircularProgress)`
  color: white !important;
`;

const Toast = styled(Alert)`
  width: 400px;
  margin: 20px 0;
`;

export {
  WelcomeHeading,
  SectionLabel,
  SectionSubLabel,
  StyledContainer,
  JoinButtonContainer,
  JoinButton,
  LinkContainer,
  Link,
  ButtonContainer,
  Spinner,
  Toast,
};
