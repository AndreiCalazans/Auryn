/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { SearchTest } from '../screens/search';
import renderer from 'react-test-renderer';

const data = {
  movies: [],
  tv: [],
};

test('renders correctly', () => {
  const tree = renderer.create(<SearchTest navigation={global.navigation} dispatch={jest.fn()} data={data} />).toJSON();
  expect(tree).toMatchSnapshot();
});
