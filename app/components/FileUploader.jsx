import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import PropTypes from 'prop-types';

// const host = 'http://localhost:4000';
const host = 'https://pixiehd.neetos.com';

const componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: `${host}/upload`,
  dropzoneSelector: 'body',
};

export default class FileUploader extends React.Component {
  state = {
    files: [],
  };

  onSuccess = (file) => {
    const {
      name: title,
      xhr: {
        response,
      },
    } = file;
    const {
      responseText: img,
    } = JSON.parse(response);
    const {
      files,
    } = this.state;
    const newFile = {
      title,
      img: `${host}/${img}`,
    };

    this.setState({
      files: [
        ...files,
        newFile,
      ],
    });

    this.onAddToCanvas(newFile);
  };

  onAccept = (file, done) => {
    done();
  };

  onAddToCanvas = (file) => {
    const {
      onAddToCanvas,
    } = this.props;

    if (onAddToCanvas) {
      onAddToCanvas(file);
    }
  };

  render() {
    const eventHandlers = {
      complete: this.onComplete,
      success: this.onSuccess,
    };
    const djsConfig = {
      acceptedFiles: 'image/jpeg,image/png,image/gif',
      previewsContainer: false,
      accept: this.onAccept,
      dictDefaultMessage: 'UPLOAD',
    };

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
  onAddToCanvas: undefined,
};

FileUploader.propTypes = {
  onAddToCanvas: PropTypes.func,
};
