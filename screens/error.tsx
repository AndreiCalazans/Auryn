import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface ErrorProps {
  text: string;
}

export const Error: React.FunctionComponent<ErrorProps> = ({ text }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 3,
    backgroundColor: '#143672',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 36,
    color: 'white',
  },
});
