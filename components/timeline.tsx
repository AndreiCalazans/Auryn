/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { TimelineRef, TimelineRefProps } from '@youi/react-native-youi';

type TimelineProps = Partial<TimelineRefProps> & {
  onLoad: (ref: Timeline) => void;
  onCompleted: () => void;
  name: string;
};

export class Timeline extends React.PureComponent<TimelineProps> {
  static defaultProps = {
    onLoad: () => {},
    onCompleted: () => {},
    direction: 'forward',
  };

  innerRef!: TimelineRef;

  resolve?: (value?: string) => void;

  render() {
    return (
      <TimelineRef
        {...this.props}
        name={this.props.name}
        onLoad={(timeline: TimelineRef) => {
          this.innerRef = timeline;
          this.props.onLoad(this);
        }}
        loop={this.props.loop || this.props.name.toLowerCase() === 'loop'}
        onCompleted={this.onCompleted}
      />
    );
  }

  play = (seek: number = 0) =>
    new Promise(resolve => {
      this.resolve = resolve;
      if (seek) this.innerRef.seek(this.props.direction === 'forward' ? seek : 1 - seek);
      else this.innerRef.play();
    });

  stop = () =>
    new Promise(resolve => {
      this.resolve = resolve;
      this.innerRef.stop();
    });

  onCompleted = () => {
    if (this.resolve && !this.props.loop) this.resolve('onCompleted');

    this.props.onCompleted();
  };
}
