import * as React from 'react';
import { BSearchBar, BContainer, BVisitationCard } from '@/components';
import { TextInput } from 'react-native-paper';
import {
  DeviceEventEmitter,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { resScale } from '@/utils';
import { SEARCH_PO } from '@/navigation/ScreenNames';
import { useNavigation } from '@react-navigation/native';
import { CreateScheduleContext } from '@/context/CreateScheduleContext';

export default function FirstStep() {
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateScheduleContext);
  const { stepOne: state } = values;
  const { updateValueOnstep } = action;

  const listenerCallback = React.useCallback(
    ({ data }: { data: any }) => {
      const newArray = [...state.products, data];
      const uniqueArray = newArray.reduce((acc, obj) => {
        if (!acc[obj.id]) {
          acc[obj.id] = obj;
        }
        return acc;
      }, {} as { [id: number]: any });
      updateValueOnstep('stepOne', 'products', Object.values(uniqueArray));
      updateValueOnstep('stepTwo', 'products', Object.values(uniqueArray));
    },
    [state.products, updateValueOnstep]
  );

  React.useEffect(() => {
    DeviceEventEmitter.addListener('event.testEvent', listenerCallback);
    return () => {
      DeviceEventEmitter.removeAllListeners('event.testEvent');
    };
  }, [listenerCallback]);

  return (
    <View>
      {state?.title && state?.products ? (
        <>
          <View>
            {/* <BVisitationCard item={state?.products} /> */}
          </View>
        </>
      ) : (
        <>
          <View>
            <TouchableOpacity
              style={style.touchable}
              onPress={() => {
                navigation.navigate(SEARCH_PO, { isGobackAfterPress: true });
              }}
            />
            <BSearchBar
              placeholder="Cari PO"
              activeOutlineColor="gray"
              left={<TextInput.Icon icon="magnify" />}
            />
          </View>
        </>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: resScale(4),
    height: resScale(45),
    zIndex: 2,
  },
});
