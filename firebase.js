import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

const RNfirebaseConfig = {
  apiKey: 'AIzaSyDxYIUFYBkcFzdjfZG3n-fJihnFI4kBkak',
  authDomain: 'taxi-a519a.firebaseapp.com',
  projectId: 'taxi-a519a',
  storageBucket: 'taxi-a519a.appspot.com',
  messagingSenderId: '86030206296',
  appId: '1:86030206296:web:697c10bd4bdc612118912d',
  measurementId: 'G-NSJCF6WZG2',
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(RNfirebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export {auth};
