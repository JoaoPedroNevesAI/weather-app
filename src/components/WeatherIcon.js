import React from 'react';
import CloudSvg from '../../assets/icons/cloud.svg';
import CloudlyDaySvg from '../../assets/icons/cloudly_day.svg';
import CloudlyNightSvg from '../../assets/icons/cloudly_night.svg';
import RainSvg from '../../assets/icons/rain.svg';
import SunSvg from '../../assets/icons/sun.svg';

export default function WeatherIcon({ description, currently = 'dia', size = 40 }) {
  const desc = description.toLowerCase();
  let IconComponent = SunSvg;

  if (desc.includes('chuva')) IconComponent = RainSvg;
  else if (desc.includes('nublado')) {
    IconComponent = currently === 'noite' ? CloudlyNightSvg : CloudlyDaySvg;
  } else if (desc.includes('sol')) IconComponent = SunSvg;
  else IconComponent = CloudSvg;

  return <IconComponent width={size} height={size} />;
}