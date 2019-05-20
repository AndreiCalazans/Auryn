/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { Composition, ViewRef, ScrollRef, ButtonRef, FocusManager, BackHandler } from '@youi/react-native-youi';
import { View, NativeEventSubscription } from 'react-native';
import { Timeline, ToggleGroup, List } from '../components';
import {
  withNavigationFocus,
  NavigationActions,
  NavigationScreenProps,
  NavigationEventSubscription,
} from 'react-navigation';
import { connect, DispatchProp } from 'react-redux';
import { tmdb } from '../actions';
import { Asset } from '../adapters/asset';
import { Config } from '../config';
import { TmdbActionTypes } from '../typings/tmdbReduxTypes';
import { AurynAppState } from '../reducers';
import { ListItemFocusEvent, ListItemPressEvent } from '../components/listitem';
import { ToggleButtonPress } from '../components/toggleButton';

interface LanderProps extends NavigationScreenProps, DispatchProp<TmdbActionTypes> {
    isFocused: boolean;
    tv: Asset[];
    discover: Asset[];
    movies: Asset[];
  };

interface LanderState {
  currentListIndex: number;
}

class Lander extends React.Component<LanderProps, LanderState> {
  state = { currentListIndex: 0 };

  lists: React.RefObject<List>[] = Array(4).fill(React.createRef<List>());

  lastFocusItem = React.createRef<ButtonRef>();

  lastFocusNavItem = React.createRef<ButtonRef>();

  navButtonNames: string[] = ['Discover', 'Movies', 'Shows', 'Live'];

  focusListener!: NavigationEventSubscription;

  blurListener!: NavigationEventSubscription;

  backHandlerListener!: NativeEventSubscription;

  outTimeline = React.createRef<Timeline>();

  navInTimeline = React.createRef<Timeline>();

  inTimeline = React.createRef<Timeline>();

  menuButtons = React.createRef<ToggleGroup>();

  searchButton = React.createRef<ButtonRef>();

  profileButton = React.createRef<ButtonRef>();

  scroller = React.createRef<ScrollRef>();

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this.navigateBack);

      if (this.lastFocusNavItem && this.lastFocusNavItem.current) {
        FocusManager.enableFocus(this.lastFocusNavItem.current);
        FocusManager.focus(this.lastFocusNavItem.current);
      } else if (this.lastFocusItem && this.lastFocusItem.current) {
        FocusManager.enableFocus(this.lastFocusItem.current);
        FocusManager.focus(this.lastFocusItem.current);
      }

      if (this.inTimeline.current && this.navInTimeline.current) {
        this.navInTimeline.current.play();
        this.inTimeline.current.play();
      }
    });
    this.blurListener = this.props.navigation.addListener('didBlur', () => this.backHandlerListener.remove());

    if (this.menuButtons.current) FocusManager.focus(this.menuButtons.current.getButtonRef(0).current);
  }

  navigateBack = () => {
    if (this.menuButtons.current)
      FocusManager.focus(this.menuButtons.current.getButtonRef(this.state.currentListIndex).current);
    return true;
  };

  componentWillUnmount() {
    this.focusListener.remove();
    this.blurListener.remove();
    this.backHandlerListener.remove();
  }

  navigateToScreen = async (screen: string) => {
    const navigateAction = NavigationActions.navigate({
      routeName: screen,
    });

    if (screen === 'Search' && this.searchButton.current) this.lastFocusNavItem = this.searchButton;
    else if (screen === 'Profile' && this.profileButton.current) this.lastFocusNavItem = this.profileButton;

    if (this.outTimeline.current) await this.outTimeline.current.play();
    this.props.navigation.dispatch(navigateAction);
  };

  scrollToViewByIndex: ToggleButtonPress = index => {
    if (!Config.isRoku) {
      if (this.menuButtons.current) {
        for (let i = 0; i < this.lists.length; i++)
        FocusManager.setNextFocus(this.menuButtons.current.getButtonRef(i).current, this.lists[index].current, 'down');
      }

      if (this.menuButtons.current
        && this.searchButton.current
        && this.profileButton.current
        && this.lists[index].current
      ) {
        FocusManager.setNextFocus(this.searchButton.current, this.lists[index].current, 'down');
        FocusManager.setNextFocus(this.profileButton.current, this.lists[index].current, 'down');
        FocusManager.setNextFocus(this.lists[index].current, this.menuButtons.current.getButtonRef(index).current, 'up');
      }
    }

    this.setState({ currentListIndex: index });
    if (this.scroller.current) {
      this.scroller.current.scrollTo({
        x: 0,
        y: (index * 900) + 1, // eslint-disable-line no-extra-parens
        animated: true,
      });
    }
  };

  // eslint-disable-next-line max-params
  onFocusItem: ListItemFocusEvent = (id, type, ref, shouldChangeFocus) => {
    this.props.dispatch(tmdb.prefetchDetails(id, type));
    this.lastFocusItem = ref;

    if (shouldChangeFocus === false || Config.isRoku || !ref.current) return;

    if (this.menuButtons.current) {
      FocusManager.setNextFocus(ref.current, this.menuButtons.current.getButtonRef(this.state.currentListIndex).current, 'up');
      for (let index = 0; index < this.lists.length; index++)
        FocusManager.setNextFocus(this.menuButtons.current.getButtonRef(index).current, ref.current, 'down');
    }

    if (this.searchButton.current && this.profileButton.current) {
      FocusManager.setNextFocus(this.searchButton.current, ref.current, 'down');
      FocusManager.setNextFocus(this.profileButton.current, ref.current, 'down');
    }
  };

  onPressItem: ListItemPressEvent = async (id, type, ref) => {
    this.lastFocusItem = ref;
    this.lastFocusNavItem = null;
    const navigateAction = NavigationActions.navigate({
      routeName: 'PDP',
      params: {
        id,
        type,
      },
    });
    this.props.dispatch(tmdb.getDetailsByIdAndType(id, type));
    if (this.outTimeline.current) await this.outTimeline.current.play();
    this.props.navigation.dispatch(navigateAction);
  };

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { isFocused, tv, movies, discover } = this.props;
    const { currentListIndex } = this.state;

    // null list is used for Roku
    const nullList = (
      <Composition source="Auryn_Container-NullList">
        <List name="NullList" type="None" data={[]} focusable={false} />
      </Composition>
    );

    const lists = [
      <Composition source="Auryn_Container-Discover" key="discover">
        <List
          name="Discover"
          type="Discover"
          data={discover}
          ref={this.lists[0]}
          focusable={isFocused && currentListIndex === 0}
          onFocusItem={this.onFocusItem}
          onPressItem={this.onPressItem}
        />
      </Composition>,
      <Composition source="Auryn_Container-Movies" key="movies">
        <List
          name="Movies"
          type="Movies"
          data={movies}
          ref={this.lists[1]}
          focusable={isFocused && currentListIndex === 1}
          onFocusItem={this.onFocusItem}
          onPressItem={this.onPressItem}
        />
      </Composition>,
      <Composition source="Auryn_Container-Shows" key="shows">
        <List
          name="Shows"
          type="Shows"
          data={tv}
          ref={this.lists[2]}
          focusable={isFocused && currentListIndex === 2}
          onFocusItem={this.onFocusItem}
          onPressItem={this.onPressItem}
        />
      </Composition>,
      <Composition source="Auryn_Container-Live" key="live">
        <List
          name="Live"
          type="Live"
          data={movies.slice(0, 2)}
          ref={this.lists[3]}
          focusable={isFocused && currentListIndex === 3}
          onFocusItem={this.onFocusItem}
          onPressItem={this.onPressItem}
        />
      </Composition>,
    ];
    return (
      <Composition source="Auryn_Lander">
        <ToggleGroup
          focusable={isFocused}
          prefix="Btn-Nav-"
          names={this.navButtonNames}
          onPressItem={this.scrollToViewByIndex}
          ref={this.menuButtons}
        />
        <ButtonRef
          name="Btn-Nav-Search"
          focusable={isFocused}
          ref={this.searchButton}
          onPress={() => this.navigateToScreen('Search')}
        />
        <ButtonRef
          name="Btn-Nav-Profile"
          focusable={isFocused}
          ref={this.profileButton}
          onPress={() => this.navigateToScreen('Profile')}
        />
        <Timeline name="LanderIn" ref={this.inTimeline} />
        <Timeline name="LanderOut" ref={this.outTimeline} />
        <ScrollRef
          name="Stack"
          ref={this.scroller}
          scrollEnabled={false}
          horizontal={false}
          focusable={false}
        >
          <View>{Config.isRoku ? [lists[currentListIndex], nullList] : lists}</View>
        </ScrollRef>

        <ViewRef name="Nav">
          <Timeline name="In" ref={this.navInTimeline} />
          <Timeline name="Out" />
        </ViewRef>

        <ViewRef name="Nav-Logo">
          <Timeline name="Loop" loop={true} />
        </ViewRef>
      </Composition>
    );
  }
}

const mapStateToProps = (store: AurynAppState) => ({
  discover: store.tmdbReducer.discover.data,
  movies: store.tmdbReducer.movies.data,
  tv: store.tmdbReducer.tv.data,
});

export default withNavigationFocus(connect(mapStateToProps)(Lander));
export { Lander as LanderTest };
