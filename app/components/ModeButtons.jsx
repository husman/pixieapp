import React, { useCallback } from 'react';
import { func, number } from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import IconButton from './IconButton';
import { Icon } from './Icon';
import { setAppMode } from '../actions/view';
import {
  APP_VIEW_USER_VIDEO,
  APP_VIEW_USER_VIDEOS,
  APP_VIEW_SCREEN_SHARE,
  APP_VIEW_CANVAS,
} from '../constants/app';

const StyledFlexContainer = styled.div`
  display: flex;
  align-items: stretch;
`;

const StyledButtonContainer = styled.div`
  padding: 10px 15px;
  margin-bottom 1px;
  border-bottom: ${({ active }) => active ? '3px solid #0177B5' : 0};
`;

const APP_MODE_VIDEO = new Set([
  APP_VIEW_USER_VIDEO,
  APP_VIEW_USER_VIDEOS,
  APP_VIEW_SCREEN_SHARE,
]);

function isModeType(mode, modeType) {
  switch (modeType) {
    case APP_VIEW_USER_VIDEOS:
      return APP_MODE_VIDEO.has(mode);
    case APP_VIEW_CANVAS:
      return mode === APP_VIEW_CANVAS;
    default:
      return false;
  }
}

function ModeButton({
  mode,
  onSetMode,
}) {
  const setMode = useCallback(({
    currentTarget: {
      dataset,
    },
  }) => {
    onSetMode(parseInt(dataset.mode, 10));
  }, [onSetMode]);

  return (
    <div>
      <StyledFlexContainer>
        <StyledButtonContainer active={isModeType(mode, APP_VIEW_CANVAS)}>
          <IconButton
            active={isModeType(mode, APP_VIEW_CANVAS)}
            icon={(
              <Icon
                type="paper"
                fontSize={1.3}
              />
            )}
            fontSize="0.85em"
            data-mode={APP_VIEW_CANVAS}
            onClick={setMode}
          >
            <FormattedMessage
              id="button.mode.canvas"
              defaultMessage="Canvas"
            />
          </IconButton>
        </StyledButtonContainer>
        <StyledButtonContainer active={isModeType(mode, APP_VIEW_USER_VIDEOS)}>
          <IconButton
            active={isModeType(mode, APP_VIEW_USER_VIDEOS)}
            icon={(
              <Icon
                type="video"
                fontSize={1.3}
              />
            )}
            fontSize="0.85em"
            data-mode={APP_VIEW_USER_VIDEOS}
            onClick={setMode}
          >
            <FormattedMessage
              id="button.mode.video"
              defaultMessage="Video"
            />
          </IconButton>
        </StyledButtonContainer>
      </StyledFlexContainer>
    </div>
  );
}


function mapStateToProps(state) {
  const {
    view: {
      mode,
    },
  } = state;

  return {
    mode,
  };
}

function mapDispatchToState(dispatch) {
  return {
    onSetMode: mode => dispatch(setAppMode(mode)),
  };
}

ModeButton.propTypes = {
  mode: number.isRequired,
  onSetMode: func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToState)(ModeButton);
