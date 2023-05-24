// import React, {useState, useRef} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha';
// import {firebaseConfig} from '../firebase';
// import firebase from 'firebase/compat/app';
// import axios from 'axios';
// import AuthContext from '../components/AuthContext';

// const PhoneNumberScreen = ({navigation, route}) => {
//   const [name, setName] = useState('');
//   const [ConfirmPassword, setConfirmPassword] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [isSignUp, setIsSignUp] = useState(true);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const recaptchaVerifier = useRef(null);
//   const {setIsSignedIn} = AuthContext();

//   const checkPassword = async () => {
//     try {
//       const response = await axios.post(
//         'https://zyvlz2xt17.execute-api.us-east-1.amazonaws.com/dev/phone/check-password',
//         {
//           phonenumber: phoneNumber,
//           password: password,
//         },
//       );

//       if (response.data.message === 'Password is correct') {
//         setErrorMessage('');
//         return true;
//       } else {
//         setErrorMessage('The password is incorrect.');
//         return false;
//       }
//     } catch (error) {
//       setErrorMessage('The password is incorrect.', error);
//       return false;
//     }
//   };

//   const checkAccountExists = async () => {
//     try {
//       const response = await axios.post(
//         'https://zyvlz2xt17.execute-api.us-east-1.amazonaws.com/dev/phone/users/check',
//         {
//           phonenumber: phoneNumber,
//           method: 'phone',
//         },
//       );

//       return response.data.exists;
//     } catch (error) {
//       console.error('Error checking account existence:', error);
//       return false;
//     }
//   };

//   const onSendVerification = async () => {
//     let isPasswordValid = true;
//     let accountExists = false;

//     if (!isSignUp) {
//       isPasswordValid = await checkPassword();
//     } else {
//       accountExists = await checkAccountExists();
//       if (accountExists) {
//         setErrorMessage(
//           'An account with this phone number already exists try to login.',
//         );
//         return;
//       }
//     }

//     if (isPasswordValid) {
//       setLoading(true); // Start loading
//       try {
//         const phoneProvider = new firebase.auth.PhoneAuthProvider();
//         const verificationId = await phoneProvider.verifyPhoneNumber(
//           phoneNumber,
//           recaptchaVerifier.current,
//         );
//         navigation.navigate('OTPVerification', {
//           phoneNumber,
//           verificationId,
//           password,
//           setIsSignedIn,
//         });
//       } catch (error) {
//         Alert.alert(error.message);
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     }
//   };

//   const onToggleSignUp = () => {
//     setIsSignUp(!isSignUp);
//   };

//   return (
//     <View style={styles.container}>
//       <FirebaseRecaptchaVerifierModal
//         ref={recaptchaVerifier}
//         firebaseConfig={firebaseConfig}
//       />
//       <Text style={styles.otpText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
//       <TextInput
//         placeholder="Phone Number"
//         onChangeText={setPhoneNumber}
//         keyboardType="phone-pad"
//         autoCompleteType="tel"
//         style={styles.textInput}
//       />
//       {isSignUp && (
//         <TextInput
//           placeholder="Name"
//           onChangeText={setName}
//           style={styles.textInput}
//         />
//       )}

//       {isSignUp && (
//         <TextInput
//           placeholder="Phone Number"
//           onChangeText={setPhoneNumber}
//           keyboardType="phone-pad"
//           autoCompleteType="tel"
//           style={styles.textInput}
//         />
//       )}

//       <TextInput
//         placeholder="Password"
//         onChangeText={setPassword}
//         secureTextEntry
//         style={styles.textInput}
//       />

//       {isSignUp && (
//         <TextInput
//           placeholder="Confirm Password"
//           onChangeText={setConfirmPassword}
//           secureTextEntry
//           style={styles.textInput}
//         />
//       )}

//       {errorMessage !== '' && (
//         <Text style={styles.errorText}>{errorMessage}</Text>
//       )}

//       {loading && <ActivityIndicator size="large" color="#3498db" />}

//       <TouchableOpacity
//         style={styles.sendVerification}
//         onPress={onSendVerification}>
//         <Text style={styles.buttonText}>
//           {isSignUp ? 'Sign Up' : 'Sign In'}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.toggleButton}
//         onPress={() => setIsSignUp(!isSignUp)}>
//         <Text style={styles.buttonText}>
//           {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textInput: {
//     paddingTop: 20,
//     paddingBottom: 10,
//     paddingHorizontal: 10,
//     fontSize: 24,
//     borderBottomColor: '#fff',
//     borderBottomWidth: 2,
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#fff',
//   },
//   sendVerification: {
//     padding: 20,
//     backgroundColor: '#3498db',
//     borderRadius: 10,
//   },
//   toggleButton: {
//     padding: 10,
//     marginTop: 20,
//   },
//   buttonText: {
//     textAlign: 'center',
//     color: '#ffffff',
//     fontWeight: 'bold',
//   },
//   otpText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     margin: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: 'red',
//     marginBottom: 10,
//   },
// });

// export default PhoneNumberScreen;
