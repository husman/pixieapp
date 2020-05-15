import React, { useCallback } from 'react';
import {
  bool,
  func,
  string,
} from 'prop-types';
import { TextField as InputField } from '@material-ui/core';
import styled from 'styled-components';

const TextFieldContainer = styled.div`
  text-align: left;
  margin: 25px 0;
`;

function TextField({
  label,
  value,
  required,
  onChange,
}) {
  const onTextChange = useCallback(({
    target: {
      value,
    },
  }) => {
    if (onChange) {
      onChange(value);
    }
  }, [onChange]);

  return (
    <TextFieldContainer>
      <InputField
        required={required}
        fullWidth
        label={label}
        variant="outlined"
        size="small"
        value={value}
        onChange={onTextChange}
      />
    </TextFieldContainer>
  );
}

TextField.defaultProps = {
  value: '',
  required: false,
};

TextField.propTypes = {
  label: string.isRequired,
  value: string,
  required: bool,
  onChange: func,
};

export default TextField;
