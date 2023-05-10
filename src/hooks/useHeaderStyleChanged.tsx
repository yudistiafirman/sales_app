import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

type HeaderStyleProps = {
  titleColor?: string;
  bgColor?: string;
};

export default function useHeaderStyleChanged({
  titleColor,
  bgColor,
}: HeaderStyleProps) {
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
