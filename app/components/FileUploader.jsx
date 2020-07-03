import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import { SkyLightStateless } from 'react-skylight';
import styled from 'styled-components';
import {
  canvasUploadComplete,
  canvasUploadStart,
  onFileUploaderInit,
  addedImageDocumentToCanvas,
} from '../actions/canvas';
import ProgressBar from './ProgressBar';
import CanvasLib from '../lib/Canvas';

// const host = 'http://localhost:4000';
// const host = 'https://pixiehd.neetos.com';
const host = 'http://184.73.115.12:9000';
// const host = 'http://localhost:9000';

const componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: `${host}/upload`,
};

const FILE_TYPE_IMAGE = 'image';
const FILE_TYPE_PDF = 'pdf';

const SUPPORTED_FILE_TYPES = new Set([
  FILE_TYPE_IMAGE,
  FILE_TYPE_PDF,
]);

const ThumbnailContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%
  height: 100%;
`;

const Thumbnail = styled.div`
  margin-right: 10px;
  margin-bottom: 10px;
  height: 250px;
  border-radius: 5px;
  padding: 3px;
  box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  transition: all 0.3s ease-out;

  :hover {
    box-shadow:0 1px 4px rgba(255, 0, 0, 0.1), 0 0 40px rgba(255, 0, 0, 0.6) inset;
  }
`;

const PdfImage = styled.img`
  cursor: pointer;
  width: 100%%;
  height: 100%;
  object-fit: contain;
`;

export class FileUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPdfModalOpened: false,
      pdfUrls: [],
      progress: 0,
    };
  }

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

    if (!uploadedFiles || !SUPPORTED_FILE_TYPES.has(uploadedFiles.type)) {
      return;
    }

    switch (uploadedFiles.type) {
      case FILE_TYPE_PDF:
        uploadedFiles.urls.sort();

        onCanvasUploadComplete({
          type: FILE_TYPE_PDF,
          urls: uploadedFiles.urls,
        });
        break;
      case FILE_TYPE_IMAGE:
        onCanvasUploadComplete({
          type: FILE_TYPE_IMAGE,
          url: uploadedFiles.url,
        });
        break;
      default:
        console.error(`Unsupported upload type: ${uploadedFiles.type}`);
    }
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

  addImageToCanvas = (url) => {
    this.setState({
      isPdfModalOpened: false,
      pdfUrls: [],
    });

    this.props.onImageInsertedIntoCanvas();
    CanvasLib.onAddImageToCanvas(url);
  };

  onDrop = ({
    dataTransfer,
  }) => {
    const documentType = dataTransfer.getData('document/type');

    switch (documentType) {
      case 'image': {
        const url = dataTransfer.getData('image/url');

        this.addImageToCanvas(url);
        break;
      }
      case 'pdf': {
        const docIndex = dataTransfer.getData('document/index');
        const pdfDocument = this.props.files[docIndex];

        this.setState({
          isPdfModalOpened: true,
          pdfUrls: pdfDocument.urls,
        });
        break;
      }
      default:
    }
  };

  onUploadProgress = (progress) => {
    this.setState({
      progress,
    });
  };

  onInit = (dropzone) => {
    const {
      onFileUploaderInit,
    } = this.props;

    onFileUploaderInit(dropzone);
  };

  onClosePdfModal = () => {
    this.setState({
      isPdfModalOpened: false,
      pdfUrls: [],
    });
  };

  render() {
    const {
      selector,
      isUploading,
    } = this.props;
    const {
      progress,
      isPdfModalOpened,
      pdfUrls,
    } = this.state;
    const eventHandlers = {
      init: this.onInit,
      success: this.onSuccess,
      sending: this.onSending,
      totaluploadprogress: this.onUploadProgress,
      drop: this.onDrop,
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
      <React.Fragment>
        <DropzoneComponent
          config={componentConfig}
          eventHandlers={eventHandlers}
          djsConfig={djsConfig}
        />
        {isUploading && <ProgressBar value={progress} />}
        {isPdfModalOpened && (
          <SkyLightStateless
            isVisible
            onCloseClicked={this.onClosePdfModal}
            dialogStyles={{
              width: '50%',
              height: '50%',
              'overflow-y': 'auto',
            }}
          >
            <ThumbnailContainer>
              {pdfUrls.map(url => (
                <Thumbnail
                  key={url}
                  onClick={() => this.addImageToCanvas(url)}
                >
                  <PdfImage
                    src={url}
                    alt={url}
                  />
                </Thumbnail>
              ))}
            </ThumbnailContainer>
          </SkyLightStateless>
        )}
      </React.Fragment>
    );
  }
}

FileUploader.defaultProps = {
  selector: true,
  files: [],
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
function mapStateToProps({
  canvas: {
    isUploading,
    files,
  },
}) {
  return {
    isUploading,
    files,
  };
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
    onFileUploaderInit: dropzone => dispatch(onFileUploaderInit(dropzone)),
    onImageInsertedIntoCanvas: () => dispatch(addedImageDocumentToCanvas()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileUploader);
