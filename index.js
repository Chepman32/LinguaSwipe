/**
 * @format
 */

// Must be at the top for react-native-gesture-handler
import 'react-native-gesture-handler';
// Reanimated must be imported at the top-level as well
import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
