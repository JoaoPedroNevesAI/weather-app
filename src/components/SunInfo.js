import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SunriseDaySvg from '../../assets/icons/sunrise_day.svg';
import SunriseNightSvg from '../../assets/icons/sunrise_night.svg';
import SunsetDaySvg from '../../assets/icons/sunset_day.svg';
import SunsetNightSvg from '../../assets/icons/sunset_night.svg';

export default function SunInfo({ sunrise, sunset, isNight = false }) {
  const SunriseIcon = isNight ? SunriseNightSvg : SunriseDaySvg;
  const SunsetIcon = isNight ? SunsetNightSvg : SunsetDaySvg;

  return (
    <View style={styles.sunContainer}>
      <View style={styles.sunBlock}>
        <SunriseIcon width={30} height={30} />
        <Text style={styles.sunText}>{sunrise}</Text>
      </View>
      <View style={styles.sunBlock}>
        <SunsetIcon width={30} height={30} />
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
  sunText: { color: '#fff', marginTop: 5, fontSize: 14 },
});