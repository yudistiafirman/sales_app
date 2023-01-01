import React from 'react';

import colors from '@/constants/colors';
import layout from '@/constants/layout';
import { scaleSize } from '@/utils';
import { View, Text, Image, StyleProp, ViewStyle } from 'react-native';
import { Divider } from 'react-native-paper';
import { BCardOption, BContainer, BSearchBar, BText } from '@/components';
const company = require('@/assets/icon/Visitation/company.png');

interface Styles {
  [key: string]: StyleProp<ViewStyle>;
}

const styles: Styles = {
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 100,
  },
};

const CreateVisitation = () => {
  return (
    <BContainer>
      <BSearchBar />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            borderColor: 'black',
          }}
        />
        <BText>Atau Buat Baru Dibawah</BText>
        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            borderColor: 'black',
          }}
        />
      </View>
      <View style={styles.optionContainer}>
        <BCardOption icon={company} title="Perusahaan" fullWidth />
        <BCardOption icon={company} title="Individu" fullWidth />
      </View>
    </BContainer>
  );
};

export default CreateVisitation;
