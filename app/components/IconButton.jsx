import React from 'react';
import {
  bool,
  node,
  string,
} from 'prop-types';
import styled from 'styled-components';

const StyledLink = styled.a`
  text-decoration: none;
  color: ${({ active, color }) => color || (active ? '#0177B5' : '#626262')};
  margin-right: ${props => props.marginRight || 0}px;
  cursor: pointer;
  font-size: ${props => props.fontSize || 'inherit'};
`;

const StyledLabel = styled.span`
  margin-left: ${props => props.labelAlign === 'right' ? 5 : 0}px;
  margin-right: ${props => props.labelAlign === 'left' ? 5 : 0}px;
`;

export default function IconButton({
  icon,
  children,
  labelAlign,
  active,
  ...styles
}) {
  const label = <StyledLabel labelAlign={labelAlign}>{children}</StyledLabel>;

  return (
    <StyledLink active={active} {...styles}>
      {labelAlign === 'left' && label}
      {icon}
      {labelAlign === 'right' && label}
    </StyledLink>
  );
}

IconButton.defaultProps = {
  labelAlign: 'right',
  active: false,
};

IconButton.propTypes = {
  icon: node.isRequired,
  children: node.isRequired,
  labelAlign: string,
  active: bool,
};
