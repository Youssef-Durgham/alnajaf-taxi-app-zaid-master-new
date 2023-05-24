/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firebase from '@react-native-firebase/app';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import 'react-native-gesture-handler';

const firebaseConfig = {
  apiKey: 'AIzaSyDxYIUFYBkcFzdjfZG3n-fJihnFI4kBkak',
  authDomain: 'taxi-a519a.firebaseapp.com',
  projectId: 'taxi-a519a',
  storageBucket: 'taxi-a519a.appspot.com',
  messagingSenderId: '86030206296',
  appId: '1:86030206296:web:697c10bd4bdc612118912d',
  measurementId: 'G-NSJCF6WZG2',
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AppWithGestureHandler = gestureHandlerRootHOC(App);

AppRegistry.registerComponent(appName, () => AppWithGestureHandler);
