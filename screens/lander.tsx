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
import { connect } from 'react-redux';
import { Asset } from '../adapters/asset';
import { Config } from '../config';
import { AurynAppState } from '../reducers';
import { ListItemFocusEvent, ListItemPressEvent } from '../components/listitem';
import { ToggleButtonPress, ToggleButton } from '../components/toggleButton';
import { ListType } from '../components/list';
import { prefetchDetails, getDetailsByIdAndType } from '../actions/tmdbActions';

type LanderDispatchProps = typeof mapDispatchToProps;

interface LanderProps extends NavigationScreenProps, LanderDispatchProps {
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

  lists = Array.from(Array(4)).map(() => React.createRef<List>());

  lastFocusItem = React.createRef<ButtonRef>();

  lastFocusNavItem = React.createRef<ButtonRef>();

  focusListener!: NavigationEventSubscription;

  blurListener!: NavigationEventSubscription;

  backHandlerListener!: NativeEventSubscription;

  outTimeline = React.createRef<Timeline>();

  navInTimeline = React.createRef<Timeline>();

  inTimeline = React.createRef<Timeline>();

  menuButtons = Array.from(Array(4)).map(() => React.createRef<ToggleButton>());

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

    if (this.menuButtons[0].current) FocusManager.focus(this.menuButtons[0].current);
  }

  navigateBack = () => {
    if (this.menuButtons[this.state.currentListIndex].current)
      FocusManager.focus(this.menuButtons[this.state.currentListIndex].current);
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
      if (this.menuButtons[index].current) {
        for (let i = 0; i < this.lists.length; i++)
        FocusManager.setNextFocus(this.menuButtons[i].current, this.lists[index].current, 'down');
      }

      if (this.menuButtons[index].current
        && this.searchButton.current
        && this.profileButton.current
        && this.lists[index].current
      ) {
        FocusManager.setNextFocus(this.searchButton.current, this.lists[index].current, 'down');
        FocusManager.setNextFocus(this.profileButton.current, this.lists[index].current, 'down');
        FocusManager.setNextFocus(this.lists[index].current, this.menuButtons[index].current, 'up');
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
    this.props.prefetchDetails(id, type);
    this.lastFocusItem = ref;

    if (shouldChangeFocus === false || Config.isRoku || !ref.current) return;

    if (this.menuButtons[this.state.currentListIndex].current) {
      FocusManager.setNextFocus(ref.current, this.menuButtons[this.state.currentListIndex].current, 'up');
      for (let index = 0; index < this.lists.length; index++)
        FocusManager.setNextFocus(this.menuButtons[index].current, ref.current, 'down');
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
    this.props.getDetailsByIdAndType(id, type);
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
        <List name="NullList" type={ListType.None} data={[]} focusable={false} />
      </Composition>
    );

    const lists = [
      <Composition source="Auryn_Container-Discover" key="discover">
        <List
          name="Discover"
          type={ListType.Featured}
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
          type={ListType.Poster}
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
          type={ListType.Grid}
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
          type={ListType.LargeBackdrop}
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
        <ToggleGroup onPressItem={this.scrollToViewByIndex} initialToggleIndex={0}>
          <ToggleButton name="Btn-Nav-Discover" focusable={isFocused} ref={this.menuButtons[0]} />
          <ToggleButton name="Btn-Nav-Movies" focusable={isFocused} ref={this.menuButtons[1]} />
          <ToggleButton name="Btn-Nav-Shows" focusable={isFocused} ref={this.menuButtons[2]} />
          <ToggleButton name="Btn-Nav-Live" focusable={isFocused} ref={this.menuButtons[3]} />
        </ToggleGroup>
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

const mapDispatchToProps = {
  prefetchDetails,
  getDetailsByIdAndType,
};

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Lander));
export { Lander as LanderTest };
