import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

type useHeaderTitle = {
  title: string;
};

export default function useHeaderTitleChanged({ title }: useHeaderTitle) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
    });
  }, [navigation, title]);
}
