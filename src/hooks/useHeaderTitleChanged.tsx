import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import BHeaderTitle from '@/components/molecules/BHeaderTitle';

type useHeaderTitle = {
  title: string;
};

export default function useHeaderTitleChanged({ title }: useHeaderTitle) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => BHeaderTitle(title, 'flex-start'),
    });
  }, [navigation, title]);
}
