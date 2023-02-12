import React from 'react';
import { ScrollView, TextStyle, View } from 'react-native';
import { colors, fonts, layout } from '@/constants';
import { PIC, Styles } from '@/interfaces';
import { resScale } from '@/utils';
import BSpacer from '../atoms/BSpacer';
import BText from '../atoms/BText';
import { RadioButton } from 'react-native-paper';

interface IProps extends PIC {
  isOption?: boolean;
  onSelect?: (index: number) => void;
  index?: number;
  border?: boolean;
}

const styles: Styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.offWhite,
    borderRadius: layout.radius.md,
  },
};

const titleStyles: TextStyle = {
  fontFamily: fonts.family.montserrat[400],
  fontSize: fonts.size.xs,
  color: colors.text.secondary,
};

const makeStyle = ({ isOption, border }: IProps) => {
  let _style: Styles = styles;

  if (border) {
    _style = {
      container: {
        ...(_style.container as Object),
        borderWidth: 2,
        borderColor: colors.border.default,
        paddingHorizontal: resScale(20),
        paddingVertical: resScale(10),
      },
    };
  }
  if (isOption) {
    _style = {
      container: {
        ...(_style.container as Object),
        paddingHorizontal: resScale(10),
      },
    };
  }

  return _style;
};

const BPic = ({
  isOption,
  email,
  name,
  phone,
  position,
  isSelected,
  onSelect,
  index,
  border = true,
}: IProps): JSX.Element => {
  return (
    <View style={makeStyle({ isOption, index, onSelect, border }).container}>
      {isOption && (
        <React.Fragment>
          <RadioButton
            value={phone!}
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => {
              if (onSelect) {
                onSelect(index!);
              }
            }}
          />
          <BSpacer size="extraSmall" />
        </React.Fragment>
      )}
      <View>
        <BText style={titleStyles}>Nama</BText>
        <BText sizeInNumber={fonts.size.sm} bold="500">
          {name ? name : '-'}
        </BText>
        <BSpacer size="extraSmall" />
        <BText style={titleStyles}>No. Telepon</BText>
        <View style={{ width: resScale(120) }}>
          <ScrollView horizontal={true}>
            <BText sizeInNumber={fonts.size.sm} bold="500">
              {phone ? '+62' + phone : '-'}
            </BText>
          </ScrollView>
        </View>
      </View>
      <BSpacer size="extraSmall" />
      <View>
        <BText style={titleStyles}>Jabatan</BText>
        <BText sizeInNumber={fonts.size.sm} bold="500">
          {position ? position : '-'}
        </BText>
        <BSpacer size="extraSmall" />
        <BText style={titleStyles}>email</BText>
        <View style={{ width: resScale(120) }}>
          <ScrollView horizontal={true}>
            <BText sizeInNumber={fonts.size.sm} bold="500">
              {email ? email : '-'}
            </BText>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default BPic;
