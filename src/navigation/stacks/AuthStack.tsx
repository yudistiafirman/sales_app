import { TypedNavigator } from '@react-navigation/native';
import Login from '@/screens/Login';
import Verification from '@/screens/Verification';
import BStackScreen from '../elements/BStackScreen';

/**
 * @deprecated The method should not be used
 */
const AuthStack = ({
  Stack,
}: {
  Stack: TypedNavigator<any, any, any, any, any>;
}) => {
  return [
    BStackScreen({
      Stack: Stack,
      name: 'Login',
      title: 'Log in',
      type: 'home',
      component: Login,
    }),
    BStackScreen({
      Stack: Stack,
      name: 'Verification',
      title: 'Kode Verifikasi',
      type: 'home',
      component: Verification,
    }),
  ];
};
export default AuthStack;
