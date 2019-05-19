/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { ListRef, RefProps, ListItem as ListItemType } from '@youi/react-native-youi';
import { FlatListProps } from 'react-native';
import { DiscoverContainer, ListItem, TvContainer } from '.';
import { isEqual, chunk } from 'lodash';
import { ImageType } from './listitem';
import { Config } from '../config';
import { Asset } from '../adapters/asset';

interface ListProps extends FlatListProps<Asset> {
  type: string;
  focusable: boolean;
  onPressItem: () => void;
  onFocusItem: () => void;
  name: string;
  data: Asset[];
};

type ImageSettings = ImageType & { length: number };

export class List extends React.Component<ListProps, {}> {
  static defaultProps = {
    extraData: [],
  };

  getImageSettings = (): ImageSettings => {
    switch (this.props.type) {
      case 'Movies':
        return { type: 'Poster', size: 'Small', length: 400 };
      case 'Shows':
        return { type: 'Backdrop', size: 'Small', length: 534 };
      case 'Live':
      case 'Discover':
        return { type: 'Backdrop', size: 'Large', length: 1068 };
      default:
        return { type: 'Backdrop', size: 'Small', length: 534 };
    }
  };

  imageSettings: ImageSettings = this.getImageSettings();

  chunkSize: number = this.props.type === 'Discover' ? 3 : 2;

  shouldComponentUpdate(nextProps: ListProps) {
    if (Config.isRoku) return true;

    if (!isEqual(nextProps.extraData, this.props.extraData)) return true;

    return nextProps.focusable !== this.props.focusable;
  }

  getItemLayout = (_: object, index: number) => ({
    length: this.imageSettings.length,
    offset: this.imageSettings.length * index,
    index,
  });

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
    if (this.props.type === 'Discover') {
      return (
        <DiscoverContainer
          focusable={this.props.focusable}
          onPress={this.props.onPressItem}
          onFocus={this.props.onFocusItem}
          data={item}
          index={index}
        />
      );
    }

    if (this.props.type === 'Shows') {
      return (
        <TvContainer
          focusable={this.props.focusable}
          onPress={this.props.onPressItem}
          onFocus={this.props.onFocusItem}
          data={item}
        />
      );
    }

    return null;
  };

  render() {
    const { data, type, name } = this.props;

    if (['Discover', 'Shows'].includes(type)) {
      return (
        <ListRef
          name={name}
          data={chunk(data, this.chunkSize)}
          horizontal={true}
          initialNumToRender={Config.isRoku ? 100 : 2}
          getItemLayout={this.getItemLayout}
          renderItem={this.renderMultipleItems}
          extraData={this.props.focusable}
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
