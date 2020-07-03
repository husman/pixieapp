import React, { useCallback } from 'react';
import {
  arrayOf,
  shape,
  func,
  string,
  bool,
} from 'prop-types';
import { connect } from 'react-redux';
import {
  closeScreenShareDialog,
  startScreenSharing,
} from '../actions/video';
import { getScreenSize } from '../utils/capture';
import ScreenShareDialog from './ScreenShareDialog';

function Dialogs({
  isScreenShareDialogOpened,
  screenShareSources,
  onStartScreenSharing,
  onCloseScreenShareDialog,
}) {
  const onShareScreen = useCallback(async (sourceId) => {
    if (!sourceId) {
      return;
    }

      onStartScreenSharing(sourceId);
  }, [onStartScreenSharing]);

  return (
    <React.Fragment>
      {isScreenShareDialogOpened && (
        <div className="screen-share-dialog-overlay">
          <ScreenShareDialog
            sources={screenShareSources}
            onStartSharing={onShareScreen}
            onClose={onCloseScreenShareDialog}
          />
        </div>
      )}
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  const {
    screenShare: {
      isScreenShareDialogOpened,
      screenShareSources,
    },
  } = state;

  return {
    isScreenShareDialogOpened,
    screenShareSources,
  };
}

function mapDispatchtoState(dispatch) {
  return {
    onCloseScreenShareDialog: () => dispatch(closeScreenShareDialog()),
    onStartScreenSharing: sourceId => dispatch(startScreenSharing({ sourceId })),
  };
}

Dialogs.propTypes = {
  isScreenShareDialogOpened: bool,
  screenShareSources: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired,
    }),
  ),
  onStartScreenSharing: func.isRequired,
  onCloseScreenShareDialog: func.isRequired,
};

export default connect(mapStateToProps, mapDispatchtoState)(Dialogs);
