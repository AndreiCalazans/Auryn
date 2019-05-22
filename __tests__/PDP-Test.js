/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { PdpTest } from '../screens/pdp';
import { Provider } from 'react-redux';
import store from '../store';
import { fromApi } from '../adapters/dummyAdapter';

import renderer from 'react-test-renderer';

const asset = fromApi(false);

test('renders correctly', () => {
  const tree = renderer.create(<Provider store={store}>
    <PdpTest asset={asset}
      navigation={global.navigation}
      dispatch={jest.fn()}
    />
  </Provider>).toJSON();
  expect(tree).toMatchSnapshot();
});
