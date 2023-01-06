import { TypedNavigator } from '@react-navigation/native';
import BStackScreen from '@/navigation/elements/BStackScreen';
import SearchProduct from '@/screens/SearchProduct';
import Location from '@/screens/Location';
import SearchAreaProject from '@/screens/SearchAreaProject';
import CreateVisitation from '@/screens/Visitation/CreateVisitation';

function TestStack({
  Stack,
}: {
  Stack: TypedNavigator<any, any, any, any, any>;
}) {
  return [
    BStackScreen({
      Stack: Stack,
      name: 'Create Visitation',
      title: 'Create Visitation',
      component: CreateVisitation,
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
