/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { Composition, BackHandler, ButtonRef, TextRef, FocusManager } from '@youi/react-native-youi';
import { Timeline, BackButton } from '../components';
import { withNavigationFocus, NavigationScreenProps, NavigationEventSubscription } from 'react-navigation';
import { NativeEventSubscription } from 'react-native';
import { Config } from '../config';

interface ProfileProps extends NavigationScreenProps {
  isFocused: boolean;
}

interface ProfileState {
  activeButtonIndex: number;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
  state = { activeButtonIndex: 1 }

  focusListener!: NavigationEventSubscription;

  blurListener!: NavigationEventSubscription;

  backHandlerListener!: NativeEventSubscription;

  outTimeline = React.createRef<Timeline>();

  activeButton = React.createRef<ButtonRef>();

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this.navigateBack);
    });
    this.blurListener = this.props.navigation.addListener('didBlur', () => this.backHandlerListener.remove());

    if (this.activeButton.current)
      FocusManager.focus(this.activeButton.current);
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.blurListener.remove();
    this.backHandlerListener.remove();
  }

  navigateBack = async () => {
    if (this.outTimeline.current)
      await this.outTimeline.current.play();

    if (Config.isRoku)
      this.props.navigation.navigate({ routeName: 'Lander' });
    else
      this.props.navigation.goBack(null);

    return true;
  }

  onPress = (i: number) => this.setState({ activeButtonIndex: i })

  render = () => {
    const buttons = Array(3).fill(null).map((_, i) =>
      <ButtonRef
        key={i}
        name={`Btn-Profile${i + 1}`}
        onPress={() => this.onPress(i + 1)}
        ref={(i + 1 === this.state.activeButtonIndex) ? this.activeButton : null}
      >
        <TextRef name="Active User" text={this.state.activeButtonIndex === i + 1 ? 'Active User' : ''} />
      </ButtonRef>);

    return (
      <Composition source="Auryn_Profile">
        <BackButton
          focusable={this.props.isFocused}
          onPress={this.navigateBack}
        />
        <Timeline name="ProfileIn" playOnLoad />
        <Timeline name="ProfileOut" ref={this.outTimeline} />
        {buttons}
      </Composition>
    );
  }
}

export default withNavigationFocus(Profile);
