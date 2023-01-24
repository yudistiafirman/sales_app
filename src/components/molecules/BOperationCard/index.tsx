import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React from 'react';

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import resScale from '@/utils/resScale';
import HighlightText from '../../atoms/BHighlightText';
import { layout } from '@/constants';
import font from '@/constants/fonts';
import colors from '@/constants/colors';
import respFS from '@/utils/resFontSize';
import Quantity from './element/Quantity';
import BButtonPrimary from '@/components/atoms/BButtonPrimary';

type OperationCardType = {
  item: {
    id: string;
    name: string;
    qty: string;
    status?: 'Dalam Produksi' | undefined;
    addressID?: string;
    onLocationPress?: () => void;
  };
  onPress?: () => void;
};

export default function BOperationCard({ item, onPress }: OperationCardType) {
  return (
    <TouchableOpacity style={style.parent} onPress={onPress}>
      <View style={style.container}>
        <View style={style.leftSide}>
          <View style={style.top}>
            <HighlightText fontSize={12} name={item.id} />
            <View style={style.status}>
              <Text style={style.statusText}>{item.status}</Text>
            </View>
          </View>
          <View>
            <Text style={style.statusText}>{item.name}</Text>
          </View>
          {item.qty && (
            <View style={style.quantity}>
              <Quantity name={item.qty} />
            </View>
          )}
        </View>
        <View style={style.rightSide}>
          <MaterialIcon size={20} name="chevron-right" />
        </View>
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
    width: resScale(330),
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderColor: '#EBEBEB',
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
    justifyContent: 'space-between',
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    height: resScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.pad.sm,
    width: resScale(285),
  },
  row: {
    flexDirection: 'row',
  },
  status: {
    padding: resScale(2),
    backgroundColor: colors.status.grey,
    paddingTop: resScale(4),
    paddingHorizontal: resScale(10),
    borderRadius: resScale(32),
  },
  statusText: {
    fontFamily: font.family.montserrat[300],
    fontSize: respFS(10),
    color: colors.textInput.input,
  },
  nameText: {
    fontFamily: font.family.montserrat[400],
    fontSize: respFS(12),
    color: colors.textInput.input,
  },
  quantity: {
    marginTop: layout.pad.lg,
  },
  location: {
    marginTop: layout.pad.xl,
    // paddingHorizontal: layout.pad.md,
  },
  locationButton: {
    borderRadius: 8,
  },
  locationTextButton: {
    fontFamily: font.family.montserrat[400],
    fontSize: respFS(12),
  },
});
