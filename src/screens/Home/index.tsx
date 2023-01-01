import * as React from 'react';
import { Text, View } from 'react-native';
import BText from '@/components/atoms/BText';
import { Button } from 'react-native-paper';
import colors from '@/constants/colors';
import BStatusBar from '@/components/atoms/BStatusBar';
import BChip from '@/components/atoms/BChip';
import layout from '@/constants/layout';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: layout.pad.lg }}>
          <BChip>Ree</BChip>
        </View>
      ),
    });
  }, [navigation]);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
      }}
    >
      <BStatusBar barStyle={'light-content'} />
      <BText>Home Screen</BText>
      <Text>Home Screen</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Create Visitation')}
      >
        Create
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Details2')}>
        Details 2
      </Button>
    </View>
  );
};

export default HomeScreen;
