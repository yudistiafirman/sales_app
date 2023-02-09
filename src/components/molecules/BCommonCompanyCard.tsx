import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import React, { useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ListRenderItem,
} from 'react-native';
import HighlightText from '../atoms/BHighlightText';
import BLocationText from '../atoms/BLocationText';
import Icon from 'react-native-vector-icons/AntDesign';
import font from '@/constants/fonts';
import { SPH } from '../organism/BCommonCompanyList';
import BChip from '../atoms/BChip';
import BSpacer from '../atoms/BSpacer';

interface BCommonCompanyCardProps {
  name?: string;
  searchQuery?: string;
  sph?: SPH[];
  location?: string;
  onPress?: (data: any) => void;
  needRightIcon?: boolean;
  customButton?: () => JSX.Element;
}

const BCommonCompanyCard = ({
  name,
  searchQuery,
  location,
  sph,
  onPress,
  needRightIcon,
  customButton,
}: BCommonCompanyCardProps) => {
  const renderButton = () => {
    if (customButton) {
      return <View style={style.rightSide}>{customButton()}</View>;
    } else {
      return (
        <TouchableOpacity style={style.rightSide} onPress={onPress}>
          <Icon name="right" />
        </TouchableOpacity>
      );
    }
  };

  const renderItem: ListRenderItem<SPH> = useCallback(({ item }) => {
    return (
      <BChip type="default" backgroundColor={colors.chip.green}>
        {item.no}
      </BChip>
    );
  }, []);
  return (
    <View style={style.container}>
      <View style={style.leftSide}>
        <View style={style.top}>
          <HighlightText
            fontSize={font.size.md}
            name={name}
            searchQuery={searchQuery}
          />
        </View>
        <BSpacer size="extraSmall" />
        <BLocationText location={location} />
        <BSpacer size="extraSmall" />
        {sph && (
          <FlatList
            data={sph}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        )}
      </View>
      {needRightIcon && renderButton()}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    borderColor: colors.border.commonCard,
    borderRadius: layout.radius.md,
    borderWidth: resScale(1),
    padding: layout.pad.md,
    minHeight: resScale(57),
  },
  leftSide: {
    justifyContent: 'space-between',
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    right: resScale(10),
  },
  top: {
    // height: resScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: layout.pad.sm,
    width: resScale(275),
  },
});

export default BCommonCompanyCard;
