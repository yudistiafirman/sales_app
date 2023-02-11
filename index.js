import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { store } from '@/redux/store';
import { injectStore } from '@/networking/request';

injectStore(store);
AppRegistry.registerComponent(appName, () => App);
