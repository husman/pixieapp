import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import {
  canvasUploadComplete,
  canvasUploadStart,
} from '../actions/canvas';

// const host = 'http://localhost:4000';
// const host = 'https://pixiehd.neetos.com';
const host = 'http://184.73.115.12:9000';

const componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: `${host}/upload`,
};

export class FileUploader extends React.Component {
  onSuccess = (file) => {
    const {
      xhr: {
        response,
      },
    } = file;
    const uploadedFiles = JSON.parse(response);
    const {
      onCanvasUploadComplete,
    } = this.props;

    if (!uploadedFiles || !uploadedFiles.length) {
      return;
    }

    uploadedFiles.sort();

    onCanvasUploadComplete({
      type: 'pdf',
      pages: uploadedFiles,
    });
  };

  onAccept = (file, done) => {
    done();
  };

  onSending = (file) => {
    const {
      onCanvasUploadStart,
    } = this.props;

    onCanvasUploadStart(file);
  };

  render() {
    const {
      selector,
    } = this.props;
    const eventHandlers = {
      complete: this.onComplete,
      success: this.onSuccess,
      sending: this.onSending,
    };
    const djsConfig = {
      acceptedFiles: 'image/jpeg,image/png,image/gif,.pdf',
      previewsContainer: false,
      accept: this.onAccept,
      dictDefaultMessage: 'UPLOAD',
    };

    if (selector) {
      componentConfig.dropzoneSelector = 'body';
    }

    return (
      <DropzoneComponent
        config={componentConfig}
        eventHandlers={eventHandlers}
        djsConfig={djsConfig}
      />
    );
  }
}

FileUploader.defaultProps = {
  selector: true,
};

FileUploader.propTypes = {
  onCanvasUploadComplete: PropTypes.func.isRequired,
  onCanvasUploadStart: PropTypes.func.isRequired,
  selector: PropTypes.bool,
};

/**
 * Called when a new app's state changes
 *
 * @param {{}} state
 *
 * @return {{}} - The props to pass to the components
 */
function mapStateToProps() {
  return {};
}

/**
 * Provides the initial state props to the component.
 *
 * @param {Function} dispatch - Used to dispatch actions.
 *
 * @return {{}} - The initial props to pass to the component.
 */
function mapDispatchToProps(dispatch) {
  return {
    onCanvasUploadComplete: file => dispatch(canvasUploadComplete(file)),
    onCanvasUploadStart: file => dispatch(canvasUploadStart(file)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileUploader);
