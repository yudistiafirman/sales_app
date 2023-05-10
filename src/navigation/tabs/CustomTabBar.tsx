/* eslint-disable react/react-in-jsx-scope */
import { View, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import TabBarStyle from './TabBarStyle';
import BText from '@/components/atoms/BText';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { RootState } from '@/redux/store';

interface TabBar {
  state: any;
  descriptors: any;
  navigation: any;
}

function CustomTabBar({ state, descriptors, navigation }: TabBar) {
  const { enable_transaction_menu, enable_price_menu, enable_profile_menu } = useSelector(
    (state: RootState) => state.auth.remote_config
  );

  const homeIcon = require('@/assets/icon/TabBarIcon/ic_home.png');
  const transIcon = require('@/assets/icon/TabBarIcon/ic_dollar-square.png');
  const profileIcon = require('@/assets/icon/TabBarIcon/ic_profile.png');
  const priceIcon = require('@/assets/icon/TabBarIcon/ic_price.png');

  const icons = [homeIcon];
  if (enable_transaction_menu) icons.push(transIcon);
  if (enable_profile_menu) icons.push(profileIcon);
  if (enable_price_menu) icons.push(priceIcon);

  return (
    <View style={TabBarStyle.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved

            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={index}
            style={{ flex: 1, alignItems: 'center' }}>
            <Image
              style={[
                TabBarStyle.icon,
                {
                  tintColor: isFocused ? colors.primary : `${colors.text.inactive}40`,
                },
              ]}
              source={icons[index]}
            />
            <BText
              style={{
                color: isFocused ? colors.primary : `${colors.text.inactive}40`,
                fontFamily: isFocused ? font.family.montserrat[700] : font.family.montserrat[500],
                fontSize: font.size.xs,
              }}>
              {label}
            </BText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default CustomTabBar;
