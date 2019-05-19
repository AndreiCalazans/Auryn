/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { Composition, TextRef, ButtonRef, ImageRef } from '@youi/react-native-youi';
import { Asset, AssetType } from '../adapters/asset';

export type ListItemFocusEvent =
  (id: number | string, type: AssetType, innerRef: React.RefObject<ButtonRef>, shouldChangeFocus?: boolean)
  => void | Promise<void>

export type ListItemPressEvent =
  (id: number | string, type: AssetType, innerRef: React.RefObject<ButtonRef>)
  => void | Promise<void>

interface ListItemProps {
  imageType: ImageType;
  data: Asset;
  shouldChangeFocus?: boolean;
  onFocus?: ListItemFocusEvent;
  onPress?: ListItemPressEvent;
  focusable?: boolean;
};

export interface ImageType {
  type: 'Poster' | 'Backdrop';
  size: 'Small' | 'Large';
}

export class ListItem extends React.Component<ListItemProps> {
  buttonName: string;

  compositionName: string;

  innerRef = React.createRef<ButtonRef>();

  constructor(props: ListItemProps) {
    super(props);
    this.buttonName = `Btn-${this.props.imageType.type}-${this.props.imageType.size}`;
    this.compositionName = `Auryn_Container-${this.buttonName}`;
  }

  shouldComponentUpdate(nextProps: ListItemProps) {
    return nextProps.focusable !== this.props.focusable;
  }

  onFocus = () => {
    if (this.props.onFocus)
      this.props.onFocus(this.props.data.id, this.props.data.type, this.innerRef, this.props.shouldChangeFocus);
  }

  onPress = () => {
    if (this.props.onPress)
      this.props.onPress(this.props.data.id, this.props.data.type, this.innerRef);
  }

  render() {
    const { data, imageType, focusable } = this.props;

    return (
      <Composition source={this.compositionName} loadSync={true}>
        <ButtonRef
          focusable={focusable}
          ref={this.innerRef}
          onFocus={this.onFocus}
          onPress={this.onPress}
          name={this.buttonName}
        >
          <ImageRef
            name="Image-Dynamic"
            source={{ uri: imageType.size === 'Small' ? data.thumbs[imageType.type] : data.images[imageType.type] }}
          />
          <TextRef name="Text-Details" text={data.details} />
          <TextRef name="Text-Title" text={data.title} />
        </ButtonRef>
      </Composition>
    );
  }
}
