import { layout, colors } from '@/constants';
import { resScale } from '@/utils';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface BImageCardProps {
  uri?: string;
  onRemoveImage: () => void;
}

const BImageCard = ({ uri, onRemoveImage }: BImageCardProps) => {
  return (
    <View style={[styles.imageContainer, styles.container]}>
      <Image source={{ uri: uri }} style={styles.imageStyle} />
      <TouchableOpacity style={styles.closeIcon} onPress={onRemoveImage}>
        <AntDesign name="close" size={resScale(10)} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: resScale(102),
    height: resScale(120),
    margin: layout.pad.sm,
  },
  imageContainer: {
    // backgroundColor: colors.tertiary,
    position: 'relative',
  },
  scrollViewContentStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: 'blue',
  },
  closeIcon: {
    position: 'absolute',
    right: resScale(-3),
    top: resScale(-3),
    width: layout.pad.md + layout.pad.sm,
    height: layout.pad.md + layout.pad.sm,
    backgroundColor: colors.icon.closeImg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: layout.radius.xl,
  },
  imageStyle: {
    flex: 1,
    borderRadius: layout.radius.md,
  },
});

export default BImageCard;
