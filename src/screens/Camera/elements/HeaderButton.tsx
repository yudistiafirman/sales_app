import * as React from 'react';
import {
  StyleProp,
  ViewStyle,
  View,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BSpacer } from '@/components';
import { FlashList } from '@shopify/flash-list';

type configType = {
  style?: StyleProp<ViewStyle>;
  onPressFlashlight: () => void;
  onPressHDR: () => void;
  onPressHighQuality: () => void;
  onPressLowBoost: () => void;
  enableFlashlight: boolean;
  enableHDR: boolean;
  enableHighQuality: boolean;
  enableLowBoost: boolean;
};

const HeaderButton = ({
  style,
  onPressFlashlight,
  onPressHDR,
  enableFlashlight,
  enableHDR,
  onPressHighQuality,
  enableHighQuality,
  onPressLowBoost,
  enableLowBoost,
}: configType) => {
  const cameraHeaderButtonValue = [
    {
      onPress: onPressFlashlight,
      iconName: enableFlashlight ? 'flash' : 'flash-off',
    },
    {
      onPress: onPressHDR,
      iconName: enableHDR ? 'hdr' : 'hdr-off',
    },
    {
      onPress: onPressHighQuality,
      iconName: enableHighQuality ? 'high-definition' : 'standard-definition',
    },
    {
      onPress: onPressLowBoost,
      iconName: enableLowBoost
        ? 'lightbulb-on-outline'
        : 'lightbulb-off-outline',
    },
  ];

  const renderItem: ListRenderItem<{ onPress: () => void; iconName: String }> =
    React.useCallback(({ item }) => {
      return (
        <>
          <BSpacer size={'small'} />
          <TouchableOpacity
            style={styles.photoIconContainer}
            onPress={item.onPress}
          >
            <MaterialCommunityIcons
              name={item.iconName}
              color={colors.white}
              size={resScale(20)}
            />
          </TouchableOpacity>
        </>
      );
    }, []);

  return (
    <>
      <View style={[styles.cameraBtn, style]}>
        <View>
          <FlashList
            estimatedItemSize={4}
            renderItem={renderItem}
            data={cameraHeaderButtonValue}
            keyExtractor={(item, index) => index.toString()}
          />
          <BSpacer size={'medium'} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cameraBtn: {
    top: 0,
    bottom: 0,
    position: 'absolute',
    right: 0,
    alignItems: 'flex-end',
    marginRight: layout.pad.md,
    left: 0,
  },
  photoIconContainer: {
    width: layout.pad.xl,
    height: layout.pad.xl,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: `${colors.disabled}50`,
  },
});

export default HeaderButton;
