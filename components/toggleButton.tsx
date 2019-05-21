/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { ButtonRef, RefProps } from '@youi/react-native-youi';
import { Timeline } from '.';
import { Config } from '../config';

export type ToggleButtonPress = (index: number) => void;

interface ToggleButtonProps extends RefProps {
    index: number;
    toggled?: boolean;
    onToggle?: (index: number) => void;
    onFocus?: (buttonRef: React.RefObject<ButtonRef>) => void;
    onPress?: ToggleButtonPress;
    isRadio?: boolean;
  };

export class ToggleButton extends React.PureComponent<ToggleButtonProps, { toggled?: boolean }> {
  static defaultProps = {
    onToggle: () => {},
    onFocus: () => {},
    onPress: () => {},
    index: 0,
  };

  state = { toggled: this.props.index === 0 };

  toggleOffTimeline = React.createRef<Timeline>();

  toggleOnTimeline = React.createRef<Timeline>();

  innerRef = React.createRef<ButtonRef>();

  componentDidUpdate(prevProps: ToggleButtonProps) {
    if (this.props.toggled !== prevProps.toggled) {
      if ((this.props.toggled || !Config.isRoku) && this.toggleOnTimeline.current)
        this.toggleOnTimeline.current.play();
      else if (this.toggleOffTimeline.current)
        this.toggleOffTimeline.current.play();
    }
  }

  onFocus = () => {
    if (this.props.onFocus)
      this.props.onFocus(this.innerRef);
  };

  onPress = () => {
    if (this.props.onPress)
      this.props.onPress(this.props.index);

    if (this.props.onToggle)
      this.props.onToggle(this.props.index);

    this.setState({
      toggled: !this.state.toggled,
    });
  };

  render = () => (
      <ButtonRef
        focusable={this.props.focusable}
        name={this.props.name}
        ref={this.innerRef}
        onFocus={this.onFocus}
        onPress={this.onPress}
      >
        <Timeline
          name="Toggle-On"
          direction={this.props.toggled || Config.isRoku ? 'forward' : 'reverse'}
          ref={this.toggleOnTimeline}
          playOnLoad={this.props.toggled}
        />
        {Config.isRoku ? <Timeline name="Toggle-Off" ref={this.toggleOffTimeline} /> : null}
      </ButtonRef>
    );
}
