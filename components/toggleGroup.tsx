/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { ToggleButton } from '.';
import { RefProps } from '@youi/react-native-youi';

interface ToggleGroupProps extends RefProps {
  names: string[];
  onPressItem: () => {};
  prefix: string;
};

export class ToggleGroup extends React.Component<ToggleGroupProps, { toggles: boolean[] }> {
  public static defaultProps = {
    names: [],
    prefix: '',
    onPressItem: () => {},
  };

  state = { toggles: [true].concat(Array(this.props.names.length).fill(false)) };

  buttonRefs: React.RefObject<ToggleButton>[] = Array(this.props.names.length).fill(React.createRef<ToggleButton>());

  onToggle = (index: number) =>
    this.setState({
      toggles: this.props.names.map((_, i) => i === index),
    });

  getButtonRef = (index: number): React.RefObject<ToggleButton> => this.buttonRefs[index];

  render() {
    const { focusable, onPressItem, prefix, names } = this.props;
    return [
      names.map((name, index) => (
        <ToggleButton
          focusable={focusable}
          key={name}
          index={index}
          onToggle={this.onToggle}
          name={prefix + name}
          onPress={onPressItem}
          toggled={this.state.toggles[index]}
          isRadio={true}
          ref={this.buttonRefs[index]}
        />
      )),
    ];
  }
}
