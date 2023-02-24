import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Config from './elements/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { hasCameraPermissions } from '@/utils/permissions';
import { CAMERA } from '@/navigation/ScreenNames';
import crashlytics from '@react-native-firebase/crashlytics';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import { BHeaderIcon } from '@/components';
import { resScale } from '@/utils';

const Camera = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();

  const navigateTo = route?.params?.navigateTo;
  const closeButton = route?.params?.closeButton;
  const photoTitle = route?.params?.photoTitle;

  if (closeButton) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCustomHeaderLeft({
      customHeaderLeft: (
        <BHeaderIcon
          size={resScale(23)}
          onBack={() => navigation.goBack()}
          iconName="x"
        />
      ),
    });
  }

  useEffect(() => {
    crashlytics().log(CAMERA);
    navigation.addListener('focus', () => {
      hasCameraPermissions();
    });
  }, [navigation]);

  return (
    <View style={styles.parent}>
      <SafeAreaView style={styles.container}>
        <Config
          navigateTo={navigateTo}
          title={photoTitle}
          closeButton={closeButton}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
  },
});

export default Camera;
