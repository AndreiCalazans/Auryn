/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { Composition, BackHandler, TextInputRef, FocusManager } from '@youi/react-native-youi';
import { Timeline, List, BackButton } from '../components';
import { NavigationActions, withNavigationFocus, NavigationEventSubscription, NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Asset, AssetType } from '../adapters/asset';
import { NativeEventSubscription, View } from 'react-native';
import { Config } from '../config';
import { AurynAppState } from '../reducers';
import { getDetailsByIdAndType, prefetchDetails, search } from '../actions/tmdbActions';

type SearchDispatchProps = typeof mapDispatchToProps;

interface SearchProps extends NavigationScreenProps, SearchDispatchProps {
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
    this.props.getDetailsByIdAndType(id, type);
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

  onFocusItem = (id: any, type: AssetType) => this.props.prefetchDetails(id, type);

  search = (query: string) => this.props.search(query);

  render() { // eslint-disable-line max-lines-per-function
    const { isFocused, data: { movies, tv } } = this.props;

    if (!isFocused)
      return <View />;

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

        {tv || !Config.isRoku ? <List
            name="List-PDP"
            data={tv}
            focusable={isFocused}
            onPressItem={this.onPressItem}
            onFocusItem={this.onFocusItem}
            extraData={tv}
          />
          : null
        }
        {movies || !Config.isRoku ? <List
          name="List-Movies"
          data={movies}
          focusable={isFocused}
          onPressItem={this.onPressItem}
          onFocusItem={this.onFocusItem}
          extraData={movies}
        />
        : null}

        <Timeline name="SearchOut" ref={this.outTimeline} />
        <Timeline name="SearchIn" playOnLoad/>
      </Composition>
    );
  }
}

const mapStateToProps = (store: AurynAppState) => ({
  data: store.tmdbReducer.search.data || { tv: [], movies: [] },
});

const mapDispatchToProps = {
  getDetailsByIdAndType,
  prefetchDetails,
  search,
};

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Search));
export { Search as SearchTest };
