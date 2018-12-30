/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  SketchField,
} from 'react-sketch';
import SocketClient from 'lib/SocketClient';
import uuid from 'uuid';
import {
  CANVAS_DEFAULT_DRAWING_COLOR,
  CANVAS_DEFAULT_STROKE_WIDTH,
  CANVAS_PEER_EVENT_PATH_CREATED,
  CANVAS_PATH_CREATED,
  CANVAS_OBJECT_MODIFIED,
  CANVAS_PEER_EVENT_OBJECT_MODIFIED,
} from 'constants/canvas';

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

    this._canvas = canvas._fc;
    this.initCanvasEvents();
  };

  /**
   * Initializes the canvas' events.
   */
  initCanvasEvents = () => {
    const {
      _canvas,
    } = this;

    _canvas.on(CANVAS_PATH_CREATED, this.onCanvasPathCreated);
    _canvas.on(CANVAS_OBJECT_MODIFIED, this.onCanvasObjectModified);

    this.initCanvasSocketEvents();
  };

  /**
   * Initializes the canvas' socket events.
   */
  initCanvasSocketEvents = () => {
    SocketClient.on(CANVAS_PEER_EVENT_PATH_CREATED, this.onPeerCanvasPathCreated);
    SocketClient.on(CANVAS_PEER_EVENT_OBJECT_MODIFIED, this.onPeerCanvasObjectModified);
  };

  /**
   * Event handler for when we receive a modified canvas object path from a peer.
   *
   * @param {{}} path - The path corresponding to the object.
   * @param {Number} width - The width of the peer's canvas.
   * @param {Number} height - The height of the peer's canvas.
   * @param {String} id - The UUID for the object that was modified.
   */
  onPeerCanvasObjectModified = ({ path, width, height, id }) => {
    const {
      _canvas,
    } = this;
    const element = _canvas.getObjects().find(obj => obj.id === id);
    const isNewText = !element && path.type === 'i-text';
    const isTextEdit = element && element.text !== path.text;

    if (isNewText) {
      this.onPeerCanvasNewText({ path, width, height, id });
      return;
    }

    if (isTextEdit) {
      element.text = path.text;
      this._canvas.renderAll();
      return;
    }

    if (!element) {
      return;
    }

    const isImage = path.type === 'image';
    const {
      width: activeWidth,
      height: activeHeight,
    } = _canvas;
    const xFactor = activeWidth / width;
    const yFactor = activeHeight / height;

    const p = fabric['Path'].fromObject(path);
    const scaleX = p.scaleX;
    const scaleY = p.scaleY;
    const left = p.left;
    const top = p.top;

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

    _canvas.calcOffset();
    _canvas.renderAll();
  };

  /**
   * Event handler for when we receive a new text on the canvas from a peer.
   *
   * @param {{}} path - The path corresponding to the text.
   * @param {Number} width - The width of the peer's canvas.
   * @param {Number} height - The height of the peer's canvas.
   * @param {String} id - The UUID for the object that was modified.
   */
  onPeerCanvasNewText = ({ path, width, height, id }) => {
    const {
      _canvas,
      _canvas: {
        width: activeWidth,
        height: activeHeight,
      },
    } = this;
    const xFactor = activeWidth / width;
    const yFactor = activeHeight / height;

    const p = fabric['Path'].fromObject(path);
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

    _canvas.add(text);
    _canvas.renderAll();
  };

  /**
   * Event handler that is dispatched when an object is modified on the canvas.
   *
   * @param {Event} evt - The event.
   */
  onCanvasObjectModified = (evt) => {
    const {
      _canvas,
    } = this;
    const data = {
      id: evt.target.id,
      path: evt.target.toJSON(),
      width: _canvas.width,
      height: _canvas.height,
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
      _canvas,
    } = this;

    evt.path.id = uuid.v4();

    const data = {
      path: evt.path.toJSON(),
      width: _canvas.width,
      height: _canvas.height,
      id: evt.path.id,
    };

    SocketClient.emit(CANVAS_PEER_EVENT_PATH_CREATED, data);
  };

  /**
   * Event handler for when we receive a new path from a peer.
   *
   * @param {{}} path - The newly created path.
   * @param {Number} width - The width of the peer's canvas.
   * @param {Number} height - The height of the peer's canvas.
   * @param {String} id - The UUID for the new path.
   */
  onPeerCanvasPathCreated = ({ path, width, height, id }) => {
    const {
      _canvas,
      _canvas: {
        width: activeWidth,
        height: activeHeight,
      },
    } = this;
    const xFactor = activeWidth / width;
    const yFactor = activeHeight / height;

    const p = fabric['Path'].fromObject(path);
    const scaleX = p.scaleX;
    const scaleY = p.scaleY;
    const left = p.left;
    const top = p.top;

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

    _canvas.add(p);
    _canvas.calcOffset();
    _canvas.renderAll();
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
  };
}

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
function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
