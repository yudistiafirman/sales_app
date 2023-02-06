import { layout, colors } from '@/constants';
import { resScale } from '@/utils';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const BAddImage = ({ onAddImage }: { onAddImage: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onAddImage}
      style={[styles.addImage, styles.container]}
    >
      <Feather name="plus" size={resScale(25)} color="#000000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: resScale(102),
    height: resScale(120),
    borderRadius: layout.radius.md,
    marginRight: layout.pad.lg,
  },
  addImage: {
    backgroundColor: colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BAddImage;
