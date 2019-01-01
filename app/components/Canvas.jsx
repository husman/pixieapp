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
} from 'react-sketch';
import SocketClient from '../lib/SocketClient';
import uuid from 'uuid';
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

    this.initCanvasSocketEvents();
  };

  /**
   * Initializes the canvas' socket events.
   */
  initCanvasSocketEvents = () => {
    SocketClient.on(CANVAS_PEER_EVENT_PATH_CREATED, this.onPeerCanvasPathCreated);
    SocketClient.on(CANVAS_PEER_EVENT_OBJECT_MODIFIED, this.onPeerCanvasObjectModified);
    SocketClient.on(CANVAS_PEER_EVENT_OBJECT_DELETE, this.onPeerDeleteObjects);
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
   * Event handler for when we receive a 'delete object[s]' event from a peer.
   *
   * @param {Array} ids - Array of object UUIDs.
   */
  onPeerDeleteObjects = ({ ids }) => {
    const {
      canvas,
    } = this;
    const elements = canvas
      .getObjects()
      .filter(obj => ids.indexOf(obj.id) !== -1);

    elements.forEach(elem => canvas.remove(elem));
  };

  /**
   * Event handler for when we receive a modified canvas object path from a peer.
   *
   * @param {{}} data - The path corresponding to the object.
   */
  onPeerCanvasObjectModified = (data) => {
    const {
      canvas,
    } = this;
    const {
      path,
      width,
      height,
      id,
    } = data;
    const element = canvas.getObjects().find(obj => obj.id === id);
    const isNewText = !element && path.type === 'i-text';
    const isTextEdit = element && element.text !== path.text;

    if (isNewText) {
      this.onPeerCanvasNewText({
        path,
        width,
        height,
        id,
      });
      return;
    }

    if (isTextEdit) {
      element.text = path.text;
      this.canvas.renderAll();
      return;
    }

    if (!element) {
      return;
    }

    const isImage = path.type === 'image';
    const {
      width: activeWidth,
      height: activeHeight,
    } = canvas;
    const xFactor = activeWidth / width;
    const yFactor = activeHeight / height;

    const p = fabric.Path.fromObject(path);
    const {
      scaleX,
      scaleY,
      left,
      top,
    } = p;

    const tempScaleX = scaleX * xFactor;
    const tempScaleY = scaleY * yFactor;
    const tempLeft = left * xFactor;
    const tempTop = top * yFactor;

    if (isImage) {
      element.scaleX = scaleX;
      element.scaleY = scaleY;
    } else {
      element.scaleX = tempScaleX;
      element.scaleY = tempScaleY;
    }

    element.left = tempLeft;
    element.top = tempTop;
    element.angle = path.angle;

    element.setCoords();

    canvas.calcOffset();
    canvas.renderAll();
  };

  /**
   * Event handler for when we receive a new text on the canvas from a peer.
   *
   * @param {{}} data - The path corresponding to the text.
   */
  onPeerCanvasNewText = (data) => {
    const {
      path,
      width,
      height,
      id,
    } = data;
    const {
      canvas,
      canvas: {
        width: activeWidth,
        height: activeHeight,
      },
    } = this;
    const xFactor = activeWidth / width;
    const yFactor = activeHeight / height;

    const p = fabric.Path.fromObject(path);
    const originalLeft = p.left;
    const originalTop = p.top;

    const left = originalLeft * xFactor;
    const top = originalTop * yFactor;

    const text = new fabric.IText(path.text, {
      left,
      top,
      fill: path.fill,
    });
    text.id = id;

    canvas.add(text);
    canvas.renderAll();
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

  /**
   * Event handler for when we receive a new path from a peer.
   *
   * @param {{}} data - The newly created path.
   */
  onPeerCanvasPathCreated = (data) => {
    const {
      path,
      width,
      height,
      id,
    } = data;
    const {
      canvas,
      canvas: {
        width: activeWidth,
        height: activeHeight,
      },
    } = this;
    const xFactor = activeWidth / width;
    const yFactor = activeHeight / height;

    const p = fabric.Path.fromObject(path);
    const {
      scaleX,
      scaleY,
      left,
      top,
    } = p;
    const tempScaleX = scaleX * xFactor;
    const tempScaleY = scaleY * yFactor;
    const tempLeft = left * xFactor;
    const tempTop = top * yFactor;

    p.id = id;
    p.scaleX = tempScaleX;
    p.scaleY = tempScaleY;
    p.left = tempLeft;
    p.top = tempTop;

    p.setCoords();

    canvas.add(p);
    canvas.calcOffset();
    canvas.renderAll();
  };

  render() {
    const {
      tool,
    } = this.props;

    return (
      <SketchField
        tool={tool}
        lineColor={CANVAS_DEFAULT_DRAWING_COLOR}
        lineWidth={CANVAS_DEFAULT_STROKE_WIDTH}
        className="canvas"
        ref={this.initCanvas}
        width="100%"
        height="100%"
      />
    );
  }
}

Canvas.propTypes = {
  tool: PropTypes.string.isRequired,
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
