/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { ToggleButton } from '.';

interface ToggleGroupProps {
  initialToggleIndex: number;
  onPressItem: (index: number) => void;
};

export class ToggleGroup extends React.Component<ToggleGroupProps, { activeButtonIndex: number }> {
  state = { activeButtonIndex: -1 };

  initialToggleIndex = this.props.initialToggleIndex;

  render() {
    // eslint-disable-next-line consistent-return
    return React.Children.map(this.props.children, (child, index) => {
      if (child.type === ToggleButton) {
        return React.cloneElement(child, {
          onPress: () => {
            this.initialToggleIndex = -1;
            if (this.state.activeButtonIndex === index) return;

            this.setState({ activeButtonIndex: index }, this.onPress);

            if (this.props.onPressItem)
              this.props.onPressItem(index);
             else if (child.props.onPress)
              child.props.onPress();
          },
          toggled: this.initialToggleIndex === index || this.state.activeButtonIndex === index,
        });
      };
    });
  }
}
