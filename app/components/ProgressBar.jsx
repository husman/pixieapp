import React from 'react';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';


const Container = styled.div`
  position: absolute;
  bottom: 1px;
  left: 0;
  right: 0;
`;

export default function ProgressBar({
  value,
}) {
  return (
    <Container>
      <LinearProgress
        color="secondary"
        variant="determinate"
        size={30}
        value={value}
      />
    </Container>
  );
}
