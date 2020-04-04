/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { electronEnhancer } from 'redux-electron-store';
import createSagaMiddleware from 'redux-saga';
import './sass/presenter_toolbar.scss';
import PresenterToolbar from './components/PresenterToolbar';
import reducer from './reducers';
import sagas from './sagas';

// Redux
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  compose(
    applyMiddleware(sagaMiddleware),
    electronEnhancer({
      dispatchProxy: a => store.dispatch(a),
    }),
    composeEnhancers(),
  ),
);
sagaMiddleware.run(sagas);

window.onload = () => {
  render(
    <Provider store={store}>
      <PresenterToolbar />
    </Provider>,
    document.getElementById('presenter-toolbar'),
  );
};
