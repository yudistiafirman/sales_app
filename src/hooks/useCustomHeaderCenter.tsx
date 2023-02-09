import { ReactElement, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

type HeaderCenterProps = {
  customHeaderCenter: ReactElement<Element>;
};

export default function useCustomHeaderCenter({
  customHeaderCenter,
}: HeaderCenterProps) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => customHeaderCenter,
    });
  }, [navigation, customHeaderCenter]);
}
