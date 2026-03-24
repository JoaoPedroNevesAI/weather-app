import React from 'react';
import { Image } from 'react-native';

export default function WeatherIcon({ description, currently = 'dia', size = 40 }) {
  const desc = description.toLowerCase();

  let icon = require('../../assets/icons/sun.png');

  if (desc.includes('chuva')) {
    icon = require('../../assets/icons/rain.png');
  } else if (desc.includes('nublado')) {
    icon =
      currently === 'noite'
        ? require('../../assets/icons/cloudly_night.png')
        : require('../../assets/icons/cloudly_day.png');
  } else if (desc.includes('sol')) {
    icon = require('../../assets/icons/sun.png');
  } else {
    icon = require('../../assets/icons/cloud.png');
  }

  return <Image source={icon} style={{ width: size, height: size }} />;
}