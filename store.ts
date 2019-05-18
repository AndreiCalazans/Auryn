/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { applyMiddleware, createStore } from 'redux';
import promise from 'redux-promise-middleware';
import createDebounce from 'redux-debounced';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';

const middleware = applyMiddleware(createDebounce(), thunk, promise);

export default createStore(rootReducer, middleware);
