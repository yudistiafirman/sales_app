import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { renderHeaderTitle } from '@/utils/screenUtil';

type useHeaderTitle = {
  title: string;
};

export default function useHeaderTitleChanged({ title }: useHeaderTitle) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => renderHeaderTitle(title, 'home', 'white'),
    });
  }, [navigation, title]);
}
