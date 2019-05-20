/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { withNavigationFocus, NavigationActions, NavigationScreenProps, NavigationEventSubscription } from 'react-navigation';
import {
  BackHandler,
  ButtonRef,
  Composition,
  ImageRef,
  TextRef,
  ViewRef,
  FocusManager,
} from '@youi/react-native-youi';
import { View, NativeEventSubscription } from 'react-native';
import { connect, DispatchProp } from 'react-redux';
import { Timeline, List, BackButton } from '../components';
import { youtube, tmdb } from '../actions';
import { Asset, AssetType } from '../adapters/asset';
import { Config } from '../config';
import { YoutubeApiActions } from '../actions/youtubeActions';
import { TmdbActionTypes } from '../typings/tmdbReduxTypes';
import { AurynAppState } from '../reducers';

interface PdpProps extends NavigationScreenProps, DispatchProp<YoutubeApiActions | TmdbActionTypes> {
  isFocused: boolean;
  asset: Asset;
  fetched: boolean;
}

class PDP extends React.Component<PdpProps> {
  outTimeline = React.createRef<Timeline>();

  videoOutTimeline = React.createRef<Timeline>();

  videoInTimeline = React.createRef<Timeline>();

  contentOutTimeline = React.createRef<Timeline>();

  contentInTimeline = React.createRef<Timeline>();

  posterButton = React.createRef<ButtonRef>();

  focusListener!: NavigationEventSubscription;

  blurListener!: NavigationEventSubscription;

  backHandlerListener!: NativeEventSubscription;

  navigateBack = async () => {
    if (this.outTimeline.current)
      await this.outTimeline.current.play();

    if (Config.isRoku)
      this.props.navigation.navigate({ routeName: 'Lander' });
    else
      this.props.navigation.popToTop();

    return true;
  }

  onPressItem = async (id: any, type: AssetType) => {
    this.props.dispatch(tmdb.getDetailsByIdAndType(id, type));
    if (this.contentOutTimeline.current) await this.contentOutTimeline.current.play();
    await this.props.navigation.navigate({ routeName: 'PDP', params: { id, type }, key: id });
    if (this.posterButton.current) FocusManager.focus(this.posterButton.current);
    if (this.contentInTimeline.current) this.contentInTimeline.current.play();
  }

  onFocusItem = (id: any, type: AssetType) => this.props.dispatch(tmdb.prefetchDetails(id, type));

  componentDidMount() {

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this.navigateBack);

      if (this.videoOutTimeline.current) this.videoOutTimeline.current.play();
    });

    this.blurListener = this.props.navigation.addListener('didBlur', () => this.backHandlerListener.remove());
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.blurListener.remove();
    this.backHandlerListener.remove();
  }

  shouldComponentUpdate(nextProps: PdpProps) {
    // Re-render if lost/gained focus
    if (nextProps.isFocused !== this.props.isFocused)
      return true;

    if (nextProps.fetched && !this.props.fetched)
      return true;

    // Only render if the asset.id matches the requested pdp asset id
    return nextProps.asset.id === nextProps.navigation.getParam('id');
  }

  playVideo = async () => {
    if (this.videoInTimeline.current)
      await this.videoInTimeline.current.play();
    this.props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'Video',
    }));
  }

  onFocusPoster = () => {
    this.props.dispatch(youtube.getVideoSourceByYoutubeId(this.props.asset.youtubeId));
  }

  onLoad = () => {
    if (this.posterButton.current)
      FocusManager.focus(this.posterButton.current);
  }

  render() { // eslint-disable-line max-lines-per-function
    const { asset, fetched, isFocused } = this.props;

    if (!fetched || !isFocused)
      return <View/>;

    return (
      <Composition source="Auryn_PDP">
        <Timeline name="VideoIn" ref={this.videoInTimeline} />
        <Timeline name="VideoOut" ref={this.videoOutTimeline} />
        <Timeline name="PDPIn" playOnLoad />
        <Timeline name="PDPOut" ref={this.outTimeline} />

        <ViewRef name="PDP-Scroller" visible={isFocused && fetched}>
          <BackButton
            focusable={isFocused}
            onPress={this.navigateBack}
          />
          <List
            name="List-PDP"
            data={asset.similar}
            focusable={isFocused}
            onPressItem={this.onPressItem}
            onFocusItem={this.onFocusItem}
          />

          <Timeline
            name="ContentIn"
            ref={this.contentInTimeline}
            onLoad={ref => ref.play()} />
          <Timeline name="ContentOut" ref={this.contentOutTimeline} />

          <ButtonRef
            name="Btn-Poster-Large"
            focusable={isFocused}
            onPress={this.playVideo}
            ref={this.posterButton}
            onLoad={this.onLoad}
            onFocus={this.onFocusPoster}
          >
            <ImageRef
              name="Image-Dynamic"
              source={{ uri: asset.thumbs.Poster }}
            />
          </ButtonRef>

          <ImageRef
            name="Image-Dynamic-Background"
            source={{ uri: asset.images.Backdrop }}
          />

          <ViewRef name="Layout-PDP-Meta">
            <TextRef name="Text-Title" text={asset.title} />
            <TextRef name="Text-Overview" text={asset.details} />
            <TextRef name="Text-Featured" text={asset.extra} />
            <Timeline name="In2" playOnLoad />
          </ViewRef>

        </ViewRef>
      </Composition>
    );
  }
}

const mapStateToProps = (store: AurynAppState): PdpProps => ({
  asset: store.tmdbReducer.details.data,
  fetched: store.tmdbReducer.details.fetched,
});

export default withNavigationFocus(connect(mapStateToProps)(PDP));
export { PDP as PdpTest };
