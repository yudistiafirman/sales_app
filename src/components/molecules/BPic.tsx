import React from 'react';
import { View } from 'react-native';
import { Colors, Layout } from '@/constants';
import { Styles } from '@/interfaces';
import { scaleSize } from '@/utils';
import BSpacer from '../atoms/BSpacer';
import BText from '../atoms/BText';
import { RadioButton } from 'react-native-paper';

interface IProps {
  isOption?: boolean;
}

const styles: Styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleSize.moderateScale(20),
    paddingVertical: scaleSize.verticalScale(10),
    backgroundColor: Colors.offWhite,
    borderRadius: Layout.radius.md,
    borderWidth: 2,
    borderColor: Colors.border.default,
  },
};

const makeStyle = ({ isOption }: IProps) => {
  let _style: Styles = styles;

  if (isOption) {
    _style = {
      container: {
        ...(_style.container as Object),
        paddingHorizontal: scaleSize.moderateScale(10),
      },
    };
  }

  return _style;
};

const BPic = ({ isOption }: IProps): React.ReactNode => {
  return (
    <View style={makeStyle({ isOption }).container}>
      {isOption && (
        <React.Fragment>
          <RadioButton value="first" status={'checked'} onPress={() => {}} />
          <BSpacer size="extraSmall" />
        </React.Fragment>
      )}
      <View>
        <BText>Nama</BText>
        <BText bold="bold">Johnny</BText>
        <BSpacer size="extraSmall" />
        <BText>No. Telepon</BText>
        <BText bold="bold">+62 811 2886 9884</BText>
      </View>
      <BSpacer size="extraSmall" />
      <View>
        <BText>Jabatan</BText>
        <BText bold="bold">Mandor</BText>
        <BSpacer size="extraSmall" />
        <BText>email</BText>
        <BText bold="bold">johnny@gmail.com</BText>
      </View>
    </View>
  );
};

export default BPic;
