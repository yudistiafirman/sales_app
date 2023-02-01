import HighlightText from '@/components/atoms/BHighlightText';
import Location from '@/components/molecules/BVisitationCard/elements/Location';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
export type CustomersData = {
  id?: string;
  display_name?: string;
  location?: string;
};

interface CustomersCard {
  searchQuery?: string;
  onPress?: (data: CustomersData) => void;
  item: CustomersData;
}

const AppointmentCustomerCard = ({
  display_name,
  location,
  searchQuery,
  item,
  onPress,
}: CustomersCard & CustomersData) => {
  return (
    <View style={style.container}>
      <View style={style.leftSide}>
        <View style={style.top}>
          <HighlightText
            fontSize={14}
            name={display_name!}
            searchQuery={searchQuery}
          />
        </View>
        <Location location={location} />
      </View>
      <TouchableOpacity
        style={style.rightSide}
        onPress={() => {
          if (onPress) {
            onPress(item);
          }
        }}
      >
        <Icon name="right" color={colors.text.darker} />
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    borderColor: '#EBEBEB',
    borderRadius: layout.radius.md,
    borderWidth: resScale(1),
    marginTop: layout.pad.lg,
    padding: layout.pad.lg,
  },
  leftSide: {
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
    width: resScale(275),
  },
  row: {
    flexDirection: 'row',
  },
  bottom: {
    marginTop: layout.pad.md,
  },
});

export default AppointmentCustomerCard;
