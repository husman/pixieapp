/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import {
  SketchField,
  Tools,
} from 'react-sketch';
import uuid from 'uuid';
import SocketClient from '../lib/SocketClient';
import {
  CANVAS_DEFAULT_DRAWING_COLOR,
  CANVAS_DEFAULT_STROKE_WIDTH,
  CANVAS_PEER_EVENT_PATH_CREATED,
  CANVAS_PATH_CREATED,
  CANVAS_OBJECT_MODIFIED,
  CANVAS_PEER_EVENT_OBJECT_MODIFIED,
  CANVAS_PEER_EVENT_OBJECT_DELETE,
  CANVAS_TEXT_ELEMENT_TYPES,
} from '../constants/canvas';
import {
  KEYBOARD_KEY_BACKSPACE,
} from '../constants/keyboard';
import Uploader from './FileUploader';
import CanvasLib from '../lib/Canvas';

class Canvas extends React.Component {
  /**
   * Initializes the canvas.
   *
   * @param {{}} canvas - The canvas DOM element.
   */
  initCanvas = (canvas) => {
    if (!canvas) {
      return;
    }

    const {
      _fc: frontCanvas,
    } = canvas;

    this.canvas = frontCanvas;
    CanvasLib.init(this.canvas);
    this.initCanvasEvents();
  };

  /**
   * Initializes the canvas' events.
   */
  initCanvasEvents = () => {
    const {
      canvas,
    } = this;

    // Document events
    document.onkeyup = this.onKeyUp;

    // Canvas events
    canvas.on(CANVAS_PATH_CREATED, this.onCanvasPathCreated);
    canvas.on(CANVAS_OBJECT_MODIFIED, this.onCanvasObjectModified);
    canvas.on(CANVAS_OBJECT_MODIFIED, this.onCanvasObjectModified);
    canvas.on(CANVAS_OBJECT_MODIFIED, this.onCanvasObjectModified);
  };

  onKeyUp = (evt) => {
    const {
      target,
      key,
    } = evt;

    // Do nothing if the target element is empty or the target element is a text field.
    if (!target || CANVAS_TEXT_ELEMENT_TYPES.has(target.elementType)) {
      return;
    }

    switch (key) {
      case KEYBOARD_KEY_BACKSPACE:
        this.onDeleteCanvasSelection();
        break;
      default:
      // Do nothing
    }
  };

  /**
   * Handler for canvas 'delete selection' events.
   */
  onDeleteCanvasSelection = () => {
    const {
      canvas,
    } = this;
    const selection = canvas.getActiveObject();
    const selectionGroup = canvas.getActiveGroup();
    const ids = [];

    if (selection) {
      canvas.remove(selection);
      ids.push(selection.id);
    } else if (selectionGroup) {
      const objectsInGroup = selectionGroup.getObjects();
      canvas.discardActiveGroup();

      objectsInGroup.forEach((object) => {
        ids.push(object.id);
        canvas.remove(object);
      });
    }

    if (ids.length > 0) {
      SocketClient.emit(CANVAS_PEER_EVENT_OBJECT_DELETE, { ids });
    }
  };

  /**
   * Event handler that is dispatched when an object is modified on the canvas.
   *
   * @param {Event} evt - The event.
   */
  onCanvasObjectModified = (evt) => {
    const {
      canvas,
    } = this;
    const {
      target,
    } = evt;
    const data = {
      id: target.id,
      path: target.toJSON(),
      width: canvas.width,
      height: canvas.height,
    };

    SocketClient.emit(CANVAS_PEER_EVENT_OBJECT_MODIFIED, data);
  };

  /**
   * Event handler that is dispatched when a new path is created on the canvas.
   *
   * @param {Event} evt - The event.
   */
  onCanvasPathCreated = (evt) => {
    const {
      canvas,
    } = this;
    const {
      path,
    } = evt;

    path.id = uuid.v4();

    const data = {
      path: path.toJSON(),
      width: canvas.width,
      height: canvas.height,
      id: path.id,
    };

    SocketClient.emit(CANVAS_PEER_EVENT_PATH_CREATED, data);
  };

  render() {
    const {
      tool,
    } = this.props;

    return (
      <React.Fragment>
        <Uploader />
        <SketchField
          tool={tool}
          lineColor={CANVAS_DEFAULT_DRAWING_COLOR}
          lineWidth={CANVAS_DEFAULT_STROKE_WIDTH}
          className="canvas"
          ref={this.initCanvas}
          width="100%"
          height="100%"
        />
      </React.Fragment>
    );
  }
}

Canvas.defaultProps = {
  tool: Tools.Pencil,
};

Canvas.propTypes = {
  tool: PropTypes.string,
};

/**
 * Called when a new app's state changes
 *
 * @param {{}} state
 *
 * @return {{}} - The props to pass to the components
 */
function mapStateToProps(state) {
  const {
    canvas: {
      tool,
    },
  } = state;

  return {
    tool,
  };
}

/**
 * Provides the initial state props to the component.
 *
 * @param {Function} dispatch - Used to dispatch actions.
 *
 * @return {{}} - The initial props to pass to the component.
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
