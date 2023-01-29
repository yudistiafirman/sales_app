import { TypedNavigator } from '@react-navigation/native';
import BStackScreen from '@/navigation/elements/BStackScreen';
import SearchProduct from '@/screens/SearchProduct';
import Location from '@/screens/Location';
import SearchAreaProject from '@/screens/SearchAreaProject';
import CreateVisitation from '@/screens/Visitation/CreateVisitation';
import Preview from '@/screens/Camera/Preview';
import Camera from '@/screens/Camera';
import Schedule from '@/screens/Operation/Schedule';
import SubmitForm from '@/screens/Operation/SubmitForm';

function TestStack({
  Stack,
}: {
  Stack: TypedNavigator<any, any, any, any, any>;
}) {
  return [
    BStackScreen({
      Stack: Stack,
      name: 'CreateVisitation',
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
    BStackScreen({
      Stack: Stack,
      name: 'Camera',
      title: 'Camera',
      component: Camera,
    }),
    BStackScreen({
      Stack: Stack,
      name: 'Preview',
      title: 'Preview',
      component: Preview,
    }),
    BStackScreen({
      Stack: Stack,
      name: 'Schedule',
      title: 'Ops - Schedule',
      component: Schedule,
    }),
    BStackScreen({
      Stack: Stack,
      name: 'SubmitForm',
      title: 'Ops - Submit Form',
      component: SubmitForm,
    }),
  ];
}

export default TestStack;
