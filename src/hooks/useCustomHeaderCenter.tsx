import { useNavigation } from '@react-navigation/native';
import { ReactElement, useLayoutEffect } from 'react';

type HeaderCenterProps = {
  customHeaderCenter: ReactElement<Element>;
};

export default function useCustomHeaderCenter({ customHeaderCenter }: HeaderCenterProps) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => customHeaderCenter,
    });
  }, [navigation, customHeaderCenter]);
}
