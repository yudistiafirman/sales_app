import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

type HeaderStyleProps = {
  titleColor?: string;
  bgColor?: string;
};

export default function useHeaderStyleChanged({ titleColor, bgColor }: HeaderStyleProps) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTitleStyle: {
        color: titleColor,
      },
    });
  }, [navigation, titleColor, bgColor]);
}
