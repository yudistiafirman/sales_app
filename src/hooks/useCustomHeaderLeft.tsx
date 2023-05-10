import { useNavigation } from '@react-navigation/native';
import { ReactElement, useLayoutEffect } from 'react';

type HeaderLeftProps = {
  customHeaderLeft: ReactElement<Element>;
};

export default function useCustomHeaderLeft({ customHeaderLeft }: HeaderLeftProps) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => customHeaderLeft,
    });
  }, [navigation, customHeaderLeft]);
}
