import { TypedNavigator } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import BStackScreen from '@/navigation/elements/BStackScreen';
import SearchProduct from '@/screens/SearchProduct';
import Location from '@/screens/Location';
import SearchAreaProject from '@/screens/SearchAreaProject';

function DetailsScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
      }}
    >
      <Text>Details Screen 2</Text>
    </View>
  );
}

function TestStack({
  Stack,
}: {
  Stack: TypedNavigator<any, any, any, any, any>;
}) {
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
    BStackScreen({
      Stack: Stack,
      name: 'SearchProduct',
      title: 'SearchProduct',
      component: SearchProduct,
    }),
    BStackScreen({
      Stack: Stack,
      name: 'Location',
      title: 'Pilih Area Proyek',
      component: Location,
    }),
    BStackScreen({
      Stack: Stack,
      name: 'SearchArea',
      title: 'Pilih Area Proyek',
      component: SearchAreaProject,
    }),
  ];
}

export default TestStack;
