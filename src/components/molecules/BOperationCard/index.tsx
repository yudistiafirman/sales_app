import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React from 'react';

import Icons from 'react-native-vector-icons/Feather';
import resScale from '@/utils/resScale';
import HighlightText from '../../atoms/BHighlightText';
import { layout } from '@/constants';
import font from '@/constants/fonts';
import colors from '@/constants/colors';
import respFS from '@/utils/resFontSize';
import Quantity from './element/Quantity';
import BButtonPrimary from '@/components/atoms/BButtonPrimary';
import BLocationText from '@/components/atoms/BLocationText';

type OperationCardType = {
  item: {
    id: string;
    name?: string;
    qty?: string;
    date?: string;
    status?: string;
    addressID?: string;
    onLocationPress?: () => void;
  };
  clickable: boolean;
  onPress?: () => void;
  useChevron?: boolean;
  color?: string;
  customStyle?: StyleProp<ViewStyle>;
  isQuantity?: boolean;
};

export default function BOperationCard({
  item,
  onPress,
  useChevron,
  color,
  customStyle,
  clickable,
  isQuantity = true,
}: OperationCardType) {
  return (
    <TouchableOpacity
      style={[
        style.parent,
        color ? { backgroundColor: color } : { backgroundColor: colors.white },
        customStyle && customStyle,
      ]}
      onPress={onPress}
      disabled={!clickable}
    >
      <View style={style.container}>
        <View style={style.leftSide}>
          <View style={style.top}>
            <HighlightText fontSize={12} name={item.id} />
            {item.status && (
              <View style={style.status}>
                <Text style={style.statusText}>{item.status}</Text>
              </View>
            )}
          </View>
          {item.name && (
            <View
              style={item.addressID || item.qty ? style.quantity : undefined}
            >
              <Text style={style.statusText}>{item.name}</Text>
            </View>
          )}
          {item.addressID && (
            <View style={item.qty ? style.quantity : undefined}>
              <BLocationText location={item.addressID} />
            </View>
          )}
          {item.qty && (
            <Quantity
              isQuantity={isQuantity}
              name={item.qty}
              date={item.date}
            />
          )}
        </View>
        {useChevron && (
          <View style={style.rightSide}>
            <Icons size={20} name="chevron-right" />
          </View>
        )}
      </View>
      {item.onLocationPress && (
        <View style={style.location}>
          <BButtonPrimary
            buttonStyle={style.locationButton}
            titleStyle={style.locationTextButton}
            title={'Lihat Peta'}
            isOutline
            onPress={item.onLocationPress}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  parent: {
    flex: 1,
    borderColor: colors.border.otpField,
    borderRadius: layout.radius.md,
    borderWidth: resScale(1),
    paddingVertical: layout.pad.lg,
    paddingHorizontal: layout.pad.lg,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftSide: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.pad.sm,
  },
  status: {
    padding: resScale(2),
    backgroundColor: colors.status.grey,
    paddingHorizontal: resScale(10),
    borderRadius: resScale(32),
    alignItems: 'center',
  },
  statusText: {
    fontFamily: font.family.montserrat[300],
    fontSize: respFS(10),
    color: colors.textInput.input,
  },
  quantity: {
    marginBottom: layout.pad.lg,
  },
  location: {
    marginTop: layout.pad.xl,
  },
  locationButton: {
    borderRadius: 8,
  },
  locationTextButton: {
    fontFamily: font.family.montserrat[400],
    fontSize: respFS(12),
  },
});
