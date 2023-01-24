import BText from '@/components/atoms/BText';
import colors from '@/constants/colors';
import { TypedNavigator } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { resScale } from '@/utils';
import { fonts } from '@/constants';
import respFS from '@/utils/resFontSize';
import { USER_TYPE } from '@/models/EnumModel';

const BStackScreen = ({
  Stack,
  name,
  type = 'default',
  title,
  color,
  component,
  headerShown = true,
  operationType = undefined,
}: {
  Stack: TypedNavigator<any, any, any, any, any>;
  type?: 'default' | 'home' | 'sub';
  name: string;
  title?: string;
  color?: 'primary' | 'white' | undefined;
  component: any;
  headerShown?: boolean;
  operationType?: string;
}) => {
  const opType = operationType;
  const headerTitleAlign = type === 'home' ? 'center' : 'left';
  const styles = StyleSheet.create({
    parent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
    },
    chipView: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginHorizontal: resScale(36),
    },
    chip: {
      padding: resScale(2),
      paddingHorizontal: resScale(8),
      backgroundColor: colors.chip.green,
      borderRadius: resScale(4),
    },
    chipText: {
      fontFamily: fonts.family.montserrat[300],
      fontSize: respFS(10),
      color: colors.textInput.input,
    },
    headerStyle: {
      backgroundColor:
        type === 'home' && color === 'primary' ? colors.primary : colors.white,
    },
    headerTitleStyle: {
      color:
        type === 'home' && color === 'primary'
          ? colors.text.light
          : colors.text.dark,
    },
  });

  const renderHeaderTitle = () => (
    <View style={styles.parent}>
      {opType === 'Transport' || opType === 'Dispatch' ? (
        <View style={styles.container}>
          <BText type="header" style={styles.headerTitleStyle}>
            {title}
          </BText>
          <View style={styles.chipView}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{opType}</Text>
            </View>
          </View>
        </View>
      ) : (
        <BText type="header" style={styles.headerTitleStyle}>
          {title}
        </BText>
      )}
    </View>
  );

  return (
    <Stack.Screen
      name={name}
      component={component}
      key={name}
      options={{
        headerTitleAlign: headerTitleAlign,
        headerShadowVisible: false,
        headerShown: headerShown,
        headerStyle: styles.headerStyle,
        headerTitle: () => renderHeaderTitle(),
      }}
    />
  );
};

export default BStackScreen;
