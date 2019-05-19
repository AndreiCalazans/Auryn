/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { Composition, ViewRef } from '@youi/react-native-youi';
import { View, StyleSheet } from 'react-native';
import { Timeline } from '../components';
import { tmdb } from '../actions';
import { NavigationActions, NavigationScreenProps } from 'react-navigation';
import { connect, DispatchProp } from 'react-redux';
import { Config } from '../config';
import { AnyAction } from 'redux';

interface SplashProps extends NavigationScreenProps, DispatchProp<AnyAction> {
  fetched: boolean;
};

class Splash extends React.Component<SplashProps> {
  outTimeline: React.RefObject<Timeline> = React.createRef<Timeline>();

  componentDidMount() {
    this.props.dispatch(tmdb.getDiscover());
    this.props.dispatch(tmdb.getMovies());
    this.props.dispatch(tmdb.getTv());
  }

  async componentDidUpdate() {
    if (this.props.fetched && !Config.isRoku) {
      if (!Config.isRoku && this.outTimeline.current)
        await this.outTimeline.current.play();
      const landerNavigationAction = NavigationActions.navigate({
        routeName: 'Lander',
      });
      this.props.navigation.dispatch(landerNavigationAction);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Composition source="Auryn_Splash">
          <Timeline name="SplashIn" playOnLoad />
          <Timeline name="SplashOut" ref={this.outTimeline} />
          <ViewRef name="Loader">
            <Timeline name="Loop" playOnLoad={!Config.isRoku} />
          </ViewRef>
        </Composition>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#143672',
  },
});

const mapStateToProps = store => ({
  fetched:
    store.tmdbReducer.discover.fetched
    && store.tmdbReducer.movies.fetched
    && store.tmdbReducer.tv.fetched,
});

export default connect(mapStateToProps)(Splash);
export { Splash as SplashTest };
