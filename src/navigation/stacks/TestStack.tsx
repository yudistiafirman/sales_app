import {TypedNavigator} from '@react-navigation/native';
import {Text, View} from 'react-native';
import BStackScreen from '@/navigation/elements/BStackScreen';

function DetailsScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Details Screen</Text>
    </View>
  );
}

function DetailsScreen2() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Details Screen 2</Text>
    </View>
  );
}

function TestStack({Stack}: {Stack: TypedNavigator<any, any, any, any, any>}) {
  return [
    BStackScreen({
      Stack: Stack,
      name: 'Details',
      title: 'Details',
      component: DetailsScreen,
    }),
    BStackScreen({
      Stack: Stack,
      name: 'Details2',
      title: 'Details2',
      component: DetailsScreen2,
    }),
  ];
}

export default TestStack;
