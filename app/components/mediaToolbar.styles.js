import styled from 'styled-components';

const StyledMediaToolbarRoot = styled.div`
  position: relative;
`;

const StyledMediaToolbarContainer = styled.div`
  border-width: 1px;
  border-radius: 7px;
  color: white;
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(45, 45, 45, 0.9);
  padding: 10px 20px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`;

const StyledVerticalBar = styled.div`
  flex-grow: 1;
  width: 1px;
  background-color: #828282;
`;

export {
  StyledMediaToolbarRoot,
  StyledMediaToolbarContainer,
  StyledVerticalBar,
};
