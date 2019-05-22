/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { SearchTest } from '../screens/search';
import { Provider } from 'react-redux';
import store from '../store';

import renderer from 'react-test-renderer';

const data = {
  movies: [],
  tv: [],
};

test('renders correctly', () => {
  const tree = renderer.create(<Provider store={store}>
    <SearchTest navigation={global.navigation} dispatch={jest.fn()} data={data} />
  </Provider>).toJSON();
  expect(tree).toMatchSnapshot();
});
