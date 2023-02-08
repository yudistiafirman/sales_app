import React from 'react';
import { BSearchBar } from '@/components';
import { colors, layout } from '@/constants';
import { StyleSheet, View } from 'react-native';
import { resScale } from '@/utils';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const SecondStep = () => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate('CalendarScreen')}
        style={styles.searchBarWrapper}
      >
        <BSearchBar
          disabled
          placeHolderTextColor={colors.text.dark}
          placeholder="Pilih tanggal"
          right={
            <TextInput.Icon forceTextInputFocus={false} icon="chevron-right" />
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarWrapper: {
    marginHorizontal: layout.pad.lg,
    width: resScale(328),
    height: resScale(50),
  },
});

export default SecondStep;
