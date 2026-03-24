import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SunInfo({ sunrise, sunset }) {
  return (
    <View style={styles.sunContainer}>
      <View style={styles.sunBlock}>
        <Image source={require('../../assets/icons/sunrise.png')} style={styles.icon} />
        <Text style={styles.sunText}>{sunrise}</Text>
      </View>

      <View style={styles.sunBlock}>
        <Image source={require('../../assets/icons/sunset.png')} style={styles.icon} />
        <Text style={styles.sunText}>{sunset}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sunContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },

  sunBlock: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    width: 100,
  },

  sunText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 14,
  },

  icon: {
    width: 30,
    height: 30,
  },
});