import scaleSize from '@/utils/scale';
import React from 'react';
import { Image } from 'react-native';

const BMarkers = () => {
  return (
    <Image
      style={{
        width: scaleSize.moderateScale(40),
        height: scaleSize.moderateScale(40),
      }}
      source={require('@/assets/icon/ic_marker.png')}
    />
  );
};

export default BMarkers;
