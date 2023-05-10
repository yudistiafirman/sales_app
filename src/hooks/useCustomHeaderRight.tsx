import { useNavigation } from '@react-navigation/native';
import { ReactElement, useLayoutEffect } from 'react';

type HeaderRightProps = {
  customHeaderRight: ReactElement<Element>;
};

export default function useCustomHeaderRight({ customHeaderRight }: HeaderRightProps) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => customHeaderRight,
    });
  }, [navigation, customHeaderRight]);
}
