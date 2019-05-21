/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { ListRef, ListItem as ListItemType } from '@youi/react-native-youi';
import { DiscoverContainer, ListItem, TvContainer } from '.';
import { isEqual, chunk } from 'lodash';
import { ImageType, ListItemPressEvent, ListItemFocusEvent } from './listitem';
import { Config } from '../config';
import { Asset } from '../adapters/asset';

export enum ListType {
  Featured, Poster, Grid, LargeBackdrop, SmallBackdrop, None
}

interface ListProps<T>  {
  type: ListType;
  focusable: boolean;
  onPressItem?: ListItemPressEvent;
  onFocusItem?: ListItemFocusEvent;
  name: string;
  data: T[];
  extraData?: any;
};

interface ImageSettings extends ImageType { length: number };

export class List extends React.Component<ListProps<Asset>> {
  static defaultProps = {
    extraData: [],
    type: ListType.None,
  };

  getImageSettings = (): ImageSettings => {
    switch (this.props.type) {
      case ListType.Poster:
        return { type: 'Poster', size: 'Small', length: 400 };
      case ListType.Grid:
        return { type: 'Backdrop', size: 'Small', length: 534 };
      case ListType.LargeBackdrop:
      case ListType.Featured:
        return { type: 'Backdrop', size: 'Large', length: 1068 };
      default:
        return { type: 'Backdrop', size: 'Small', length: 534 };
    }
  };

  imageSettings: ImageSettings = this.getImageSettings();

  chunkSize: number = this.props.type === ListType.Featured ? 3 : 2;

  shouldComponentUpdate(nextProps: ListProps<Asset>) {
    if (Config.isRoku) return true;

    if (!isEqual(nextProps.extraData, this.props.extraData)) return true;

    return nextProps.focusable !== this.props.focusable;
  }

  getItemLayout = (_: object, index: number) => ({
    length: this.imageSettings.length,
    offset: this.imageSettings.length * index,
    index,
  });

  keyExtractor = (_item: Asset[], index: number) => index.toString();

  renderItem = ({ item }: ListItemType<Asset>) => (
    <ListItem
      focusable={this.props.focusable}
      onFocus={this.props.onFocusItem}
      onPress={this.props.onPressItem}
      data={item}
      imageType={this.getImageSettings()}
    />
  );

  renderMultipleItems = ({ item, index }: ListItemType<Asset[]>) => {
    if (this.props.type === ListType.Featured) {
      return (
        <DiscoverContainer
          focusable={this.props.focusable}
          onPressItem={this.props.onPressItem}
          onFocusItem={this.props.onFocusItem}
          data={item}
          index={index}
        />
      );
    }

    if (this.props.type === ListType.Grid) {
      return (
        <TvContainer
          focusable={this.props.focusable}
          onPressItem={this.props.onPressItem}
          onFocusItem={this.props.onFocusItem}
          data={item}
        />
      );
    }

    return null;
  };

  render() {
    const { data, type, name } = this.props;

    if ([ListType.Featured, ListType.Grid].includes(type!)) {
      return (
        <ListRef
          name={name}
          data={chunk(data, this.chunkSize)}
          horizontal={true}
          initialNumToRender={Config.isRoku ? 100 : 2}
          getItemLayout={this.getItemLayout}
          renderItem={this.renderMultipleItems}
          extraData={this.props.focusable}
          keyExtractor={this.keyExtractor}
        />
      );
    }
    return (
      <ListRef
        name={name}
        data={data}
        horizontal={true}
        initialNumToRender={Config.isRoku ? 100 : 2}
        getItemLayout={this.getItemLayout}
        renderItem={this.renderItem}
        extraData={this.props.focusable}
      />
    );
  }
}
