import resScale from '@/utils/resScale';
import React from 'react';
import { Image } from 'react-native';

const BMarker = () => {
  return (
    <Image
      style={{
        width: resScale(40),
        height: resScale(40),
      }}
      source={require('@/assets/icon/ic_marker.png')}
    />
  );
};

export default BMarker;
