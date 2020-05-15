import React from 'react';
import {
  bool,
  string,
} from 'prop-types';
import styled from 'styled-components';

const StyledContainer = styled.span`
  background: ${props => props.background || props.backgroundColor || 'initial'};
  border: ${props => props.border || 0}px ${props => props.borderColor} solid;
  color: ${props => props.color || 'intial'};
  margin-left: ${props => props.marginLeft || 0}px;
  margin-right: ${props => props.marginRight || 0}px;
  font-size: ${props => props.fontSize || 1}em;
  padding: ${props => props.padding || 0}px;
  box-shadow: ${props => props.boxShadow || 'none'};
  cursor: pointer;
  font-family: 'Pixie';
  border-radius: ${props => props.rectBorder ? 0 : '50%'};
  display: inline-block;
`;

function IconContent({
  type,
}) {
  return (
    <span className={`icon-${type}`} />
  );
}

function Icon({
  type,
  rectBorder,
  ...styles
}) {
  return (
    <StyledContainer rectBorder={rectBorder} {...styles}>
      <IconContent type={type} />
    </StyledContainer>
  );
}

Icon.propTypes = {
  type: string.isRequired,
};

IconContent.propTypes = {
  type: string.isRequired,
  rectBorder: bool,
};

IconContent.defaultProps = {
  rectBorder: false,
};

export {
  Icon,
};
