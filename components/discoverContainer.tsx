/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { View } from 'react-native';
import { ListItem } from '.';
import { Asset } from '../adapters/asset';

interface DiscoverContainerProps {
  data: Asset[];
  onPress: () => void;
  onFocus: () => void;
  focusable: boolean;
  index: number;
}

// eslint-disable-next-line max-lines-per-function
export const DiscoverContainer: React.FunctionComponent<DiscoverContainerProps> = ({
  data,
  onPress,
  onFocus,
  focusable,
  index,
}) => {
  if (data.length !== 3) return null;

  const smallItems = (
    <View style={{ flexDirection: 'row' }}>
      <ListItem
        focusable={focusable}
        onPress={onPress}
        onFocus={onFocus}
        shouldChangeFocus={index % 2 !== 0}
        imageType={{ type: 'Backdrop', size: 'Small' }}
        data={data[0]}
      />
      <ListItem
        focusable={focusable}
        onPress={onPress}
        onFocus={onFocus}
        shouldChangeFocus={index % 2 !== 0}
        imageType={{ type: 'Backdrop', size: 'Small' }}
        data={data[1]}
      />
    </View>
  );
  const largeItem = (
    <ListItem
      focusable={focusable}
      onPress={onPress}
      onFocus={onFocus}
      shouldChangeFocus={index % 2 === 0}
      imageType={{ type: 'Backdrop', size: 'Large' }}
      data={data[2]}
    />
  );
  if (index % 2) {
    return (
      <View>
        {smallItems}
        {largeItem}
      </View>
    );
  }

  return (
    <View>
      {largeItem}
      {smallItems}
    </View>
  );
};
