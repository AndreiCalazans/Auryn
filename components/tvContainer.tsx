/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { View } from 'react-native';
import { ListItem } from './listitem';
import { Asset } from '../adapters/asset';

interface TvContainerProps {
  data: Asset[];
  onPress: () => void;
  onFocus: () => void;
  focusable: boolean;
}

export const TvContainer: React.FunctionComponent<TvContainerProps> = ({ data, onPress, onFocus, focusable }) => {
  if (data.length !== 2) return null;
  return (
    <View>
      <ListItem
        focusable={focusable}
        onPress={onPress}
        onFocus={onFocus}
        shouldChangeFocus={false}
        imageType={{ type: 'Backdrop', size: 'Small' }}
        data={data[0]}
      />
      <ListItem
        focusable={focusable}
        onPress={onPress}
        onFocus={onFocus}
        shouldChangeFocus={false}
        imageType={{ type: 'Backdrop', size: 'Small' }}
        data={data[1]}
      />
    </View>
  );
};
