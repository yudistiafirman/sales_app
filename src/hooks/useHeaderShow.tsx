import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

type useHeaderShowType = {
  isHeaderShown: boolean;
};

export default function useHeaderShow({ isHeaderShown }: useHeaderShowType) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: isHeaderShown,
    });
  }, [navigation, isHeaderShown]);
}
