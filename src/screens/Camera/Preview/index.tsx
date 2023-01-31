import React, { useMemo } from 'react';
import { BButtonPrimary } from '@/components';
import { layout } from '@/constants';
import {
  StyleProp,
  ViewStyle,
  View,
  Image,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/navTypes';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { useDispatch } from 'react-redux';
import { setImageURLS } from '@/redux/reducers/cameraReducer';

const Preview = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const route = useRoute<RootStackScreenProps>();
  const dispatch = useDispatch();
  useHeaderTitleChanged({
    title: 'Foto ' + route?.params?.photoTitle,
  });
  const navigation = useNavigation();
  const _style = useMemo(() => style, [style]);
  const photo = route?.params?.photo?.path;
  const navigateTo = route?.params?.navigateTo;

  const savePhoto = () => {
    const imagePayloadType: 'COVER' | 'GALLERY' = navigateTo
      ? 'COVER'
      : 'GALLERY';
    const photoName = photo.split('/').pop();
    const photoNameParts = photoName.split('.');
    const photoType = photoNameParts[photoNameParts.length - 1];

    console.log(route?.params?.photo, 'objectfoto');

    const imageUrls = {
      photo: {
        uri: `file:${photo}`,
        type: `image/${photoType}`,
        name: photoName,
      },
      type: imagePayloadType,
    };
    dispatch(setImageURLS(imageUrls));
    //NOTE: push your route navigation here.
    DeviceEventEmitter.emit('Camera.preview', photo);
    if (navigateTo) {
      navigation.goBack();
      navigation.dispatch(StackActions.replace(navigateTo));
    } else {
      navigation.dispatch(StackActions.pop(2));
    }
  };

  return (
    <View style={[_style, styles.parent]}>
      <View style={styles.container}>
        {photo && (
          <Image source={{ uri: `file:${photo}` }} style={styles.image} />
        )}
      </View>
      <View style={styles.conButton}>
        <View style={styles.buttonOne}>
          <BButtonPrimary
            title="Ulangi"
            isOutline
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.buttonTwo}>
          <BButtonPrimary title="Lanjut" onPress={savePhoto} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
  },
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  conButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: layout.pad.lg,
  },
  buttonOne: {
    width: '40%',
    paddingEnd: layout.pad.md,
  },
  buttonTwo: {
    width: '60%',
    paddingStart: layout.pad.md,
  },
});

export default Preview;
