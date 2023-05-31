import { AppRegistry, LogBox } from "react-native";
import { store } from "@/redux/store";
import { injectStore } from "@/networking/request";
import App from "./App";
import { name as appName } from "./app.json";

// TODO: issue on react-native-reanimated on ios
// Downgrade to react-native-reanimated@2.10.0 or upgrade to 2.12.0.
LogBox.ignoreLogs(["RCTBridge required dispatch_sync to load REAModule"]);

injectStore(store);
AppRegistry.registerComponent(appName, () => App);
