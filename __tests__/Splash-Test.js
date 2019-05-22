/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Provider } from 'react-redux';
import SplashTest from '../screens/splash';
import store from '../store';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <SplashTest navigation={global.navigation} />
      </Provider>,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
