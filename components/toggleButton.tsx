/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { ButtonRef, ButtonRefProps, ViewRefProps } from '@youi/react-native-youi';
import { Timeline } from '.';
import { Config } from '../config';

type ToggleButtonProps = ButtonRefProps &
  ViewRefProps & {
    index?: number;
    toggled?: boolean;
    onToggle?: (index: number) => void;
    onFocus?: (buttonRef: ButtonRef) => void;
    onPress?: (index: number) => void;
    isRadio?: boolean;
  };

export class ToggleButton extends React.PureComponent<ToggleButtonProps, { toggled: boolean }> {
  static defaultProps = {
    onToggle: () => {},
    onFocus: () => {},
    onPress: () => {},
  };

  toggleOffTimeline!: Timeline;

  toggleOnTimeline!: Timeline;

  innerRef!: ButtonRef;

  constructor(props: ToggleButtonProps) {
    super(props);
    this.state = {
      toggled: props.index === 0,
    };
  }

  componentDidUpdate(prevProps: ToggleButtonProps) {
    if (this.props.toggled !== prevProps.toggled) {
      this.setState(
        {
          toggled: this.props.toggled,
        },
        () => {
          this.state.toggled || !Config.isRoku ? this.toggleOnTimeline.play() : this.toggleOffTimeline.play();
        },
      );
    }
  }

  onFocus = (): void => {
    this.props.onFocus(this.innerRef);
  };

  onPress = (): void => {
    if (this.state.toggled && this.props.isRadio) return;

    this.props.onPress(this.props.index);
    this.props.onToggle(this.props.index);

    this.setState({
      toggled: !this.state.toggled,
    });
  };

  render = () => {
    const off = Config.isRoku ? (
      <Timeline name="Toggle-Off" direction={'forward'} ref={(ref: Timeline) => (this.toggleOffTimeline = ref)} />
    ) : null;

    return (
      <ButtonRef
        focusable={this.props.focusable}
        name={this.props.name}
        ref={(ref: ButtonRef) => (this.innerRef = ref)}
        onFocus={this.onFocus}
        onPress={this.onPress}
      >
        <Timeline
          name="Toggle-On"
          direction={this.state.toggled || Config.isRoku ? 'forward' : 'reverse'}
          ref={(ref: Timeline) => (this.toggleOnTimeline = ref)}
          onLoad={() => {
            if (this.state.toggled) this.toggleOnTimeline.play();
          }}
        />
        {off}
      </ButtonRef>
    );
  };
}
