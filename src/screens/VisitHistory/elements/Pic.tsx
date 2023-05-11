import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BLabel, BPic, BSpacer } from '@/components';
import { layout } from '@/constants';
import font from '@/constants/fonts';
import { picPayloadType } from '@/interfaces';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.pad.lg,
  },
});

function Pic({ pic }: { pic: picPayloadType }) {
  return (
    <View style={styles.container}>
      <BLabel sizeInNumber={font.size.md} bold="600" label="PIC" />
      <BSpacer size="extraSmall" />
      <BPic name={pic?.name} email={pic?.email} position={pic?.position} phone={pic?.phone} />
    </View>
  );
}

export default Pic;
