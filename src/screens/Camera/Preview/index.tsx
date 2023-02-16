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
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { useDispatch } from 'react-redux';
import { setImageURLS } from '@/redux/reducers/cameraReducer';
import {
  CREATE_VISITATION,
  IMAGE_PREVIEW,
  SUBMIT_FORM,
} from '@/navigation/ScreenNames';
import Entypo from 'react-native-vector-icons/Entypo';
import { resScale } from '@/utils';
import crashlytics from '@react-native-firebase/crashlytics';

function ContinueIcon() {
  return <Entypo name="chevron-right" size={resScale(24)} color="#FFFFFF" />;
}

const Preview = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();
  useHeaderTitleChanged({
    title: 'Foto ' + route?.params?.photoTitle,
  });
  const _style = useMemo(() => style, [style]);
  const photo = route?.params?.photo?.path;
  const navigateTo = route?.params?.navigateTo;
  const existingVisitation = route?.params?.existingVisitation;

  React.useEffect(() => {
    crashlytics().log(IMAGE_PREVIEW);
  }, []);

  const savePhoto = () => {
    const imagePayloadType: 'COVER' | 'GALLERY' = navigateTo
      ? 'COVER'
      : 'GALLERY';
    const photoName = photo.split('/').pop();
    const photoNameParts = photoName.split('.');
    let photoType = photoNameParts[photoNameParts.length - 1];

    if (photoType === 'jpg') {
      photoType = 'jpeg';
    }

    const imageUrls = {
      photo: {
        uri: `file:${photo}`,
        type: `image/${photoType}`,
        name: photoName,
      },
      type: imagePayloadType,
    };
    dispatch(setImageURLS(imageUrls));
    DeviceEventEmitter.emit('Camera.preview', photo);
    if (navigateTo) {
      if (
        navigateTo === 'operation' ||
        navigateTo === 'return' ||
        navigateTo === 'delivery'
      ) {
        navigation.navigate(SUBMIT_FORM, {
          type: navigateTo,
        });
      } else if (navigateTo === CREATE_VISITATION) {
        navigation.goBack();
        navigation.dispatch(
          StackActions.replace(navigateTo, { existingVisitation })
        );
      } else {
        navigation.goBack();
        navigation.dispatch(StackActions.replace(navigateTo));
      }
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
            emptyIconEnable
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.buttonTwo}>
          <BButtonPrimary
            title="Lanjut"
            onPress={savePhoto}
            rightIcon={ContinueIcon}
          />
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
    flex: 1,
    paddingEnd: layout.pad.md,
  },
  buttonTwo: {
    flex: 1.5,
    paddingStart: layout.pad.md,
  },
});

export default Preview;
