/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Clear';

export default class ScreenShareDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
    };
  }

  onSelectScreen = (sourceId) => {
    this.setState({
      selected: sourceId,
    });
  };

  /**
   * @inheritDoc
   */
  render() {
    const {
      sources = [],
      onClose,
    } = this.props;
    const {
      selected,
    } = this.state;

    return (
      <div className="screen-share-dialog">
        <div
          className="screen-share-dialog__close"
        >
          <IconButton
            color="secondary"
            aria-label="Close"
            size="small"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <h2 className="screen-share-dialog__title">
          Select a window or application you would like to share
        </h2>
        {sources.map(
          (source, index) => {
            const active = selected === null ? index === 0 : selected === source.id;

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
                  onClick={() => this.onSelectScreen(source.id)}
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
            onClick={onClose}
          >
            Start Sharing
          </Button>
        </div>
      </div>
    );
  }
}

ScreenShareDialog.defaultProps = {
  sources: [],
};

ScreenShareDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
};
