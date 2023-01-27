import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import BHeaderTitle from '@/components/molecules/BHeaderTitle';

type useHeaderTitle = {
  title: string;
  role: string;
};

export default function useHeaderTitleChanged({ title, role }: useHeaderTitle) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => BHeaderTitle(title, 'home', 'white', role),
    });
  }, [navigation, title, role]);
}
