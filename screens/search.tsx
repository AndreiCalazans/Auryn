/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { Composition, BackHandler, TextInputRef, FocusManager } from '@youi/react-native-youi';
import { tmdb } from '../actions';
import { Timeline, List, BackButton } from '../components';
import { NavigationActions, withNavigationFocus, NavigationEventSubscription, NavigationScreenProps } from 'react-navigation';
import { connect, DispatchProp } from 'react-redux';
import { Asset, AssetType } from '../adapters/asset';
import { NativeEventSubscription, View } from 'react-native';
import { Config } from '../config';
import { TmdbActionTypes } from '../typings/tmdbReduxTypes';

interface SearchProps extends NavigationScreenProps, DispatchProp<TmdbActionTypes>{
  isFocused: boolean;
  data: { tv: Asset[]; movies: Asset[] };
}

class Search extends React.Component<SearchProps> {
  focusListener!: NavigationEventSubscription;

  blurListener!: NavigationEventSubscription;

  backHandlerListener!: NativeEventSubscription;

  outTimeline = React.createRef<Timeline>();

  searchTextInput = React.createRef<TextInputRef>();

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this.navigateBack);
    });
    this.blurListener = this.props.navigation.addListener('didBlur', () => this.backHandlerListener.remove());

    if (this.searchTextInput.current)
      FocusManager.focus(this.searchTextInput.current);
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

    this.search('');
    return true;
  }

  onPressItem = async (id: any, type: AssetType)  => {
    this.props.dispatch(tmdb.getDetailsByIdAndType(id, type));
    const navigateAction = NavigationActions.navigate({
      routeName: 'PDP',
      params: {
        id,
        type,
      },
      key: id,
    });
    if (this.outTimeline.current)
      await this.outTimeline.current.play();
    this.props.navigation.dispatch(navigateAction);
  }

  onFocusItem = (id: any, type: AssetType) => this.props.dispatch(tmdb.prefetchDetails(id, type));

  search = (query: string) => this.props.dispatch(tmdb.search(query));

  render() { // eslint-disable-line max-lines-per-function
    const { isFocused, data: { movies, tv } } = this.props;

    if (!isFocused)
      return <View />;

    const tvList = tv || !Config.isRoku ? <List
      name="List-PDP"
      data={tv}
      focusable={isFocused}
      onPressItem={this.onPressItem}
      onFocusItem={this.onFocusItem}
      extraData={tv}
    /> : null;
    const moviesList = movies || !Config.isRoku ? <List
      name="List-Movies"
      data={movies}
      focusable={isFocused}
      onPressItem={this.onPressItem}
      onFocusItem={this.onFocusItem}
      extraData={movies}
    /> : null;

    return (
      <Composition source="Auryn_Search">
        <BackButton
          focusable={this.props.isFocused}
          onPress={this.navigateBack}
        />
        <TextInputRef
          ref={this.searchTextInput}
          name="TextInput"
          secureTextEntry={false}
          onChangeText={this.search}
        />

        {tvList}
        {moviesList}

        <Timeline name="SearchOut" ref={this.outTimeline} />
        <Timeline name="SearchIn" playOnLoad/>
      </Composition>
    );
  }
}

const mapStateToProps = store => ({
  data: store.tmdbReducer.search.data,
});
export default withNavigationFocus(connect(mapStateToProps)(Search));
export { Search as SearchTest };
