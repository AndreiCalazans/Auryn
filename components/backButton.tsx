/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { ButtonRef, DeviceInfo, ButtonRefProps } from '@youi/react-native-youi';

const systemName = DeviceInfo.getSystemName();
const hasHardwareBackButton = !['iOS'].includes(systemName);

export const BackButton: React.FunctionComponent<ButtonRefProps> = ({focusable, ...otherProps}) => <ButtonRef
  {...otherProps}
  name="Btn-Back"
  visible={!hasHardwareBackButton}
  focusable={focusable && !hasHardwareBackButton}
/>
