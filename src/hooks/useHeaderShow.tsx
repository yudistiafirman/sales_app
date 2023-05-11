import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

type UseHeaderShowType = {
  isHeaderShown: boolean;
};

export default function useHeaderShow({ isHeaderShown }: UseHeaderShowType) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: isHeaderShown,
    });
  }, [navigation, isHeaderShown]);
}
