import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HuddlesRecordingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Huddles Audio Recording</Text>
      {/* TODO: Integrate audio recording logic here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181A20',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 