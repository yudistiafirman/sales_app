import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';

import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { CreateScheduleContext } from '@/context/CreateScheduleContext';

export default function SecondStep() {
  const navigation = useNavigation();
  const { values } = React.useContext(CreateScheduleContext);
  const { stepTwo: state } = values;

  return (
    <View style={style.container}>
      <Text>Step 2</Text>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: layout.pad.md,
  },
  map: {
    height: resScale(450),
    width: '100%',
  },
  mapIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flex: 0.1,
    // backgroundColor: 'red',
  },
  detailCoordContainer: {
    flex: 1,
    backgroundColor: colors.tertiary,
    borderRadius: 8,
    flexDirection: 'row',
    padding: layout.pad.md,
  },
  detailContainer: {
    flex: 0.75,
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
});
