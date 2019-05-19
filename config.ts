import { DeviceInfo } from '@youi/react-native-youi';

const systemName = DeviceInfo.getSystemName();

interface Config {
  hasHardwareBackButton: boolean;
  isRoku: boolean;
}

export const Config: Config = {
  hasHardwareBackButton: !['iOS'].includes(systemName),
  isRoku: systemName === 'RokuOS',
};
