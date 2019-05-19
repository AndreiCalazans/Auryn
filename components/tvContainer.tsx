/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { View } from 'react-native';
import { ListItem, ListItemPressEvent, ListItemFocusEvent } from './listitem';
import { Asset } from '../adapters/asset';

interface TvContainerProps {
  data: Asset[];
  onPressItem?: ListItemPressEvent;
  onFocusItem?: ListItemFocusEvent;
  focusable: boolean;
}

// eslint-disable-next-line max-len
export const TvContainer: React.FunctionComponent<TvContainerProps> = ({ data, onPressItem, onFocusItem, focusable }) => {
  if (data.length !== 2) return null;
  return (
    <View>
      <ListItem
        focusable={focusable}
        onPress={onPressItem}
        onFocus={onFocusItem}
        shouldChangeFocus={false}
        imageType={{ type: 'Backdrop', size: 'Small' }}
        data={data[0]}
      />
      <ListItem
        focusable={focusable}
        onPress={onPressItem}
        onFocus={onFocusItem}
        shouldChangeFocus={false}
        imageType={{ type: 'Backdrop', size: 'Small' }}
        data={data[1]}
      />
    </View>
  );
};
