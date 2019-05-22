/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { VideoTest } from '../screens/video';
import renderer from 'react-test-renderer';
import { fromApi } from '../adapters/dummyAdapter';

const asset = fromApi(false);

test('renders correctly', () => {
  const tree = renderer.create(<VideoTest
      asset={asset}
      navigation={global.navigation}
    />).toJSON();
  expect(tree).toMatchSnapshot();
});
