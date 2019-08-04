/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Clear';

const StyledCloseButton = styled.div`
  display: inline-block;
  position: absolute;
  top: 10px;
  right: 10px;
`;

function ScreenShareDialog({
  sources = [],
  onClose,
  onStartSharing,
}) {
  const [sourceId, setSourceId] = useState(null);
  const onSelectScreen = useCallback(source => setSourceId(source), [sourceId]);

  return (
    <div className="screen-share-dialog">
      <StyledCloseButton>
        <IconButton
          color="secondary"
          aria-label="Close"
          size="small"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </StyledCloseButton>
      <h2 className="screen-share-dialog__title">
        Select a window or application you would like to share
      </h2>
      {sources.map(
        (source, index) => {
          const active = sourceId === null ? index === 0 : sourceId === source.id;

          return (
            <div
              className="screen-share-dialog__item"
              key={source.id}
            >
              <button
                type="button"
                className={
                  `screen-share-dialog__button ${active ? 'screen-share-dialog__item--selected' : ''}`
                }
                onClick={() => onSelectScreen(source.id)}
              >
                <img
                  src={source.thumbnail.toDataURL()}
                  alt={source.name}
                  width="100%"
                />
              </button>
              <div
                className="screen-share-dialog__label"
              >
                {source.name}
              </div>
            </div>
          );
        },
      )}
      <div
        className="screen-share-dialog__actions"
      >
        <Button
          variant="outlined"
          color="secondary"
          className="screen-share-dialog__cancel_button"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="screen-share-dialog__share_button"
          onClick={() => onStartSharing(sourceId)}
        >
          Start Sharing
        </Button>
      </div>
    </div>
  );
}

ScreenShareDialog.defaultProps = {
  sources: [],
};

ScreenShareDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onStartSharing: PropTypes.func.isRequired,
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
};

export default ScreenShareDialog;
