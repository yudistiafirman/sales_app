import * as React from 'react';
import colors from '@/constants/colors';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import resScale from '@/utils/resScale';
import { layout } from '@/constants';
import HighlightText from '@/components/atoms/BHighlightText';
import PillStatus from '@/components/molecules/BVisitationCard/elements/PillStatus';
import BLocationText from '@/components/atoms/BLocationText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface POListCardProps {
  companyName: string;
  locationName?: string;
  searchQuery?: string;
  sphs?: any[];
  onPress?: () => void;
  color?: string;
  useChevron?: boolean;
}

function SPH(color, item: any, index: number) {
  return (
    <View style={{ paddingEnd: layout.pad.sm }} key={index}>
      <PillStatus color={color} pilStatus={item.name} />
    </View>
  );
}

const POListCard = ({
  companyName,
  locationName,
  sphs,
  searchQuery,
  onPress,
  color,
  useChevron = true,
}: POListCardProps) => {
  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => {
        onPress();
      }}
      disabled={onPress ? false : true}
    >
      <View style={style.leftSide}>
        <View style={style.top}>
          <HighlightText
            fontSize={14}
            name={companyName}
            searchQuery={searchQuery}
          />
        </View>
        <BLocationText location={locationName ? locationName : '-'} />
        <View style={{ flexDirection: 'row', marginTop: layout.pad.md }}>
          {sphs && sphs.map((item, index) => SPH(color, item, index))}
        </View>
      </View>
      {useChevron && (
        <View style={style.rightSide}>
          <Icon name="chevron-right" size={25} color={colors.icon.darkGrey} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    borderColor: '#EBEBEB',
    borderRadius: layout.radius.md,
    borderWidth: resScale(1),
    padding: layout.pad.md,
    marginTop: layout.pad.lg,
  },
  leftSide: {
    flex: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.pad.sm,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  bottom: {
    marginTop: layout.pad.md,
  },
});

export default POListCard;
