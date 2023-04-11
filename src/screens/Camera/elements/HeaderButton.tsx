import * as React from 'react';
import { StyleProp, ViewStyle, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BSpacer } from '@/components';

type configType = {
  style?: StyleProp<ViewStyle>;
  onPressFlashlight: () => void;
  onPressHDR: () => void;
  enableFlashlight: boolean;
  enableHDR: boolean;
};

const HeaderButton = ({
  style,
  onPressFlashlight,
  onPressHDR,
  enableFlashlight,
  enableHDR,
}: configType) => {
  return (
    <>
      <View style={[styles.cameraBtn, style]}>
        <View style={styles.optionButton}>
          <BSpacer size={'small'} />
          <TouchableOpacity onPress={onPressFlashlight}>
            <Ionicons
              name={enableFlashlight ? 'flash' : 'flash-off'}
              color={colors.white}
              size={resScale(20)}
            />
          </TouchableOpacity>
          <BSpacer size={'small'} />
          {/* <TouchableOpacity onPress={onPressHDR}>
            <MaterialIcons
              name={enableHDR ? 'hdr-on' : 'hdr-off'}
              color={colors.white}
              size={resScale(20)}
            />
          </TouchableOpacity>
          <BSpacer size={'medium'} /> */}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: layout.pad.lg,
    paddingTop: layout.pad.lg,
    alignItems: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    // left: 0,
    // right: 0,
    // top: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default HeaderButton;
