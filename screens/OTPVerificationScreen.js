// import React, { useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
// import firebase from 'firebase/compat/app';
// import 'expo-firebase-core';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import { firebaseConfig } from '../firebase';

// const OTPVerificationScreen = ({ navigation, route, onSignIn }) => {
//   const { phoneNumber, password, verificationId, signupoption } = route.params;
//   const location = signupoption ? route.params.location : null;
// const fullName = signupoption ? route.params.fullName : null;
// const gender = signupoption ? route.params.gender : null;
// const occupation = signupoption ? route.params.occupation : null;
// const latitude = location ? location.latitude : null;
// const longitude = location ? location.longitude : null;
//   const [code, setCode] = useState(Array(6).fill(''));
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const recaptchaRef = useRef();
//   const inputRefs = Array.from({ length: 6 }, () => useRef());
//   const onCodeInputChange = (index, value) => {
//     if (value && index < 5 && inputRefs[index + 1].current) {
//       inputRefs[index + 1].current.focus();
//     }
//     setCode((prevState) =>
//       prevState.map((item, itemIndex) => (itemIndex === index ? value : item))
//     );
//   };

//   const onBackspace = (index) => {
//     setCode((prevState) =>
//       prevState.map((item, itemIndex) => {
//         if (itemIndex === index) {
//           if (item === '') {
//             if (index > 0 && inputRefs[index - 1].current) {
//               const prevInputRef = inputRefs[index - 1].current;
//               prevInputRef.focus();
//               prevInputRef.value = ''; // Clear the value of the previous box
//               return '';
//             }
//           } else {
//             return '';
//           }
//         } else if (itemIndex === index - 1 && prevState[itemIndex] !== '') {
//           const prevInputRef = inputRefs[itemIndex].current;
//           prevInputRef.focus();
//           return '';
//         } else if (itemIndex === index - 2 && prevState[itemIndex] !== '') {
//           const prevInputRef = inputRefs[itemIndex].current;
//           prevInputRef.focus();
//           return '';
//         } else {
//           return item;
//         }
//       })
//     );
//   };

//   const signupApi = async (phoneNumber, password, fullName, gender, occupation, location) => {
//     try {
//       // Replace with your API endpoint to sign up a user
//       const apiEndpoint = 'https://zyvlz2xt17.execute-api.us-east-1.amazonaws.com/dev/phone/signup';
//       const response = await axios.post(apiEndpoint, {
//         phonenumber: phoneNumber,
//         password: password,
//         fullname: fullName,
//         gender: gender,
//         type: occupation,
//         latitude: latitude,
//         longitude: longitude
//       });

//       if (response.data && response.data.token) {
//         await AsyncStorage.setItem('jwtToken', response.data.token);
//             onSignIn(response.data.token);
//         return true;
//       } else {
//         setErrorMessage('Error during signup. Please try again.');
//         return false;
//       }
//     } catch (error) {
//       if (error.response.data.message == 'Phone number already in use') {
//         setErrorMessage('رقم الهاتف مستخدم بالفعل.');
//       } else {
//         setErrorMessage('Error during signup. Please try again.');
//       }
//       return false;
//     }
//   };

//   const confirmCode = () => {
//     setIsLoading(true); // Set isLoading to true when the user confirms the OTP
//     const credential = firebase.auth.PhoneAuthProvider.credential(
//       verificationId,
//       code.join('')
//     );
//     firebase
//       .auth()
//       .signInWithCredential(credential)
//       .then(async () => {
//         setCode(Array(6).fill(''));

//         // Call the signupApi function to sign up the user
//         await signupApi(phoneNumber, password, fullName, gender, occupation, location)
//       })
//       .catch((error) => {
//         setCode(Array(6).fill(''));

//         setErrorMessage('OTP is incorrect try again.');
//       })
//       .finally(() => {
//         setIsLoading(false); // Set isLoading to false after the signupApi function is called
//       });
//   };

//   const resendVerification = async () => {
//     try {
//       const phoneProvider = new firebase.auth.PhoneAuthProvider();
//       const newVerificationId = await phoneProvider.verifyPhoneNumber(
//         phoneNumber,
//         recaptchaRef.current
//       );
//       navigation.navigate('OTPVerification', {
//         phoneNumber,
//         verificationId: newVerificationId,
//         password,
//         setIsSignedIn,
//         recaptchaVerifier: recaptchaRef,
//       });
//       setErrorMessage('');
//     } catch (error) {
//       setErrorMessage('Error resending the OTP. Please try again.');
//     }
//   };

//   return (
//     <View className='flex-1 bg-[#EDE9E9] items-center justify-center'>
// <FirebaseRecaptchaVerifierModal
//   ref={recaptchaRef}
//   firebaseConfig={firebaseConfig}
// />
//       <Text className='text-black font-bold text-2xl mb-5'>Verify OTP</Text>
//       <Text className="font-bold">لقد تم ارسال الكود الرجاء ادخالة في الحقل</Text>
//       <View className='flex-row justify-center mb-5'>
//         {Array(6)
//           .fill()
//           .map((_, index) => (
//             <TextInput
//             key={index}
//             placeholder=""
//             onChangeText={(value) => onCodeInputChange(index, value)}
//             keyboardType="number-pad"
//               className=
//                 'text-black text-center text-xl w-10 py-2 mx-1 border-b-2 border-black'

//                 maxLength={1}
//                 ref={(ref) => (inputRefs[index].current = ref)}
//                 onKeyPress={({ nativeEvent }) => {
//                   if (nativeEvent.key === 'Backspace') {
//                     onBackspace(index);
//                   }
//                 }}
//             />
//           ))}
//       </View>
//       <TouchableOpacity onPress={resendVerification}>
//         <Text className='text-sky-600 font-bold text-center'>
//           اعادة ارسال الكود ؟
//         </Text>
//       </TouchableOpacity>
//       {errorMessage !== '' && (
//         <Text className='text-red-500 text-lg mt-2'>{errorMessage}</Text>
//       )}
//      {isLoading ? (
//   <ActivityIndicator size="large" color="#0000ff" />
// ) : (
//   <TouchableOpacity
//     className='bg-blue-500 rounded py-2 px-8 mt-5'
//     onPress={confirmCode}
//   >
//     <Text className='text-white font-bold text-center'>
//       Confirm Verification
//     </Text>
//   </TouchableOpacity>
// )}

//     </View>
//   );
// };

// export default React.memo(OTPVerificationScreen);

import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Modal,
  Button,
} from 'react-native';
// import OtpAutoFill from 'react-native-otp-auto-fill';
import Separator from '../components/Separator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator} from 'react-native';
import {Alert} from 'react-native';
import storage from '@react-native-firebase/storage';

const VerificationScreen = ({
  route: {
    params: {
      phoneNumber,
      password,
      confirm,
      signupoption,
      confirmation,
      deviceToken,
      imageData,
      signinoption,
      locations,
      locationtitle,
      birthdate,
      cartype,
      carmodel,
      carcolor,
      carpassenger,
      carnumber,
      carnumberword,
      carnumberregion,
      scannedImages,
    },
  },
  route,
  navigation,
  props,
  onSignIn,
}) => {
  const storageRef = storage();
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const fifthInput = useRef();
  const sixthInput = useRef();
  const [otp, setOtp] = useState({1: '', 2: '', 3: '', 4: '', 5: '', 6: ''});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [UploadStatus, setUploadStatus] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(null);
  const handleOtpConfirmation = async () => {
    setModalVisible2(true);
  };
  useEffect(() => {
    // Synchronize the state and input fields after each update
    firstInput.current.setNativeProps({text: otp[1]});
    secondInput.current.setNativeProps({text: otp[2]});
    thirdInput.current.setNativeProps({text: otp[3]});
    fourthInput.current.setNativeProps({text: otp[4]});
    fifthInput.current.setNativeProps({text: otp[5]});
    sixthInput.current.setNativeProps({text: otp[6]});
  }, [otp]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);
  const location = signupoption ? route.params.location : null;
  const fullName = signupoption ? route.params.fullName : null;
  const gender = signupoption ? route.params.gender : null;
  const occupation = signupoption ? route.params.occupation : null;
  const latitude = location ? location.latitude : null;
  const longitude = location ? location.longitude : null;
  const [code, setCode] = useState(Array(6).fill(''));
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(20);
  const [resendDisabled, setResendDisabled] = useState(false);

  const recaptchaRef = useRef();
  const generateRandomName = () => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${randomString}.jpg`;
  };
  const uploadScannedImage = async (imageUri, currentIndex, totalImages) => {
    try {
      const imageBody = await fetch(imageUri);
      const imageBlob = await imageBody.blob();
      const remoteFileName = generateRandomName();

      const reference = storageRef.ref(remoteFileName);
      const uploadTask = reference.put(imageBlob);

      uploadTask.on('state_changed', snapshot => {
        // Calculate the number of images uploaded
        const imagesUploaded = currentIndex;

        // Calculate the overall progress based on the number of images uploaded
        const progress = (imagesUploaded / totalImages) * 100;

        setUploadProgress(progress);

        if (snapshot.state === 'success') {
          // Check if all images have been uploaded
          if (imagesUploaded === totalImages) {
            // All images have been uploaded
            setUploadProgress(100);
          }
        }
      });

      await uploadTask;

      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Error uploading scanned image:', error);
      throw error;
    }
  };

  const trackUploadProgress = snapshot => {
    const progress = Math.round(
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
    );

    // Calculate the overall progress based on the number of images being uploaded
    const totalImages = Object.keys(scannedImages).length;
    const overallProgress = Math.round(progress / totalImages);

    setUploadProgress(overallProgress);
  };

  const signupApi = async (phoneNumber, password, fullName) => {
    try {
      // Replace with your API endpoint to sign up a user
      const apiEndpoint =
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/phone/signup/captain';

      const scannedImagesUrls = {};
      const totalImages = Object.keys(scannedImages).length;
      let currentIndex = 1;

      if (scannedImages) {
        for (const [key, uri] of Object.entries(scannedImages)) {
          // Add a status message for the current image being uploaded
          const statusMessage = `جاري رفع المستمسك ${currentIndex}...`;
          setUploadStatus(statusMessage);

          const imageUrl = await uploadScannedImage(uri);
          scannedImagesUrls[key] = imageUrl;

          // Update the status message after the image upload is complete
          const uploadedMessage = `Image ${currentIndex} uploaded.`;
          setUploadStatus(uploadedMessage);

          currentIndex++;
        }
      }

      const payload = {
        phonenumber: phoneNumber,
        password: password,
        name: fullName,
        latitude: latitude,
        longitude: longitude,
        deviceToken: deviceToken,
        isTwoWay: isConfirmed,
        title: typeof locationtitle === 'string' ? locationtitle : '',
        birthdate: birthdate,
        carName: cartype,
        carnumber: carnumber,
        word: carnumberword,
        carModel: carmodel,
        carColor: carcolor,
        personcount: carpassenger,
        documents: JSON.stringify(scannedImagesUrls),
      };

      if (imageData && imageData.assets && imageData.assets.length > 0) {
        const {uri, type, fileName} = imageData.assets[0];
        const profileImageUrl = await uploadScannedImage(uri); // Upload profile image using existing function
        payload.captainprofile = profileImageUrl; // Set the profile image URL in the payload
      }

      const response = await axios.post(apiEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response);

      if (response.data && response.data.token) {
        setIsLoading(false);
        setModalVisible(true);
        return true;
      } else {
        console.log(response);
        setIsLoading(false);
        setErrorMessage('حدثت مشكلة أثناء إنشاء الحساب، حاول مرة أخرى');
        Alert.alert(response);
        return false;
      }
    } catch (error) {
      console.error('There was an error!', error.message);
      console.log(error);

      if (
        error.response &&
        error.response.data.message === 'Phone number already in use'
      ) {
        setErrorMessage('رقم الهاتف مستخدم بالفعل.');
      } else if (error.response) {
        console.log(error.message);
        setErrorMessage('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى');
        Alert.alert(error.message);
      } else {
        console.log(error);
        setErrorMessage('حدثت مشكلة أثناء إنشاء الحساب، حاول مرة أخرى');
        Alert.alert('API Error', error.message);
      }

      setIsLoading(false);
      return false;
    }
  };

  const confirmCode = async () => {
    try {
      setIsLoading(true); // Set isLoading to true when the user confirms the OTP

      const otpString = Object.values(otp).join('');
      const credential = await confirmation.confirm(otpString); // Use confirmation instead of confirm
      if (credential) {
        setOtp({1: '', 2: '', 3: '', 4: '', 5: '', 6: ''});
        firstInput.current.focus();
        await handleOtpConfirmation();
      }
    } catch (e) {
      setOtp({1: '', 2: '', 3: '', 4: '', 5: '', 6: ''});
      firstInput.current.focus();
      setErrorMessage('رمز التفعيل خاطيء، حاول مرة اخرى');
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      const newVerificationId = await auth().signInWithPhoneNumber(
        `+964${phoneNumber}`,
      );
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('مشكلة في ارسال الرمز، حاول مرة اخرى');
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      // Start the countdown timer
      setTimer(20);

      // Disable the resend OTP button
      setResendDisabled(true);

      // Call the resendVerification function
      await resendVerification();

      // Start the countdown timer
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === 1) {
            // Enable the resend OTP button
            setResendDisabled(false);
            clearInterval(interval);
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalButtonPress = () => {
    setModalVisible(false);
    navigation.navigate('Onboarding');
  };

  useEffect(() => {
    if (isConfirmed !== null) {
      // only call signupApi if isConfirmed is not null
      signupApi(phoneNumber, password, fullName, gender, occupation, location);
    }
  }, [isConfirmed]);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View className="h-screen w-screen bg-black/10 justify-center items-center">
          <ActivityIndicator size="large" color={'#000'} />
          <Text>{UploadStatus}</Text>
        </View>
      )}
      <StatusBar
        barStyle="dark-content"
        backgroundColor={'#FFFFFF'}
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={30}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle} className="w-[80%]">
          رمز التفعيل
        </Text>
      </View>
      <Text style={styles.title}></Text>
      <Text style={styles.content}>
        ادخل رمز التفعيل الذي ارسل للتو على الرقم الاتي{' '}
      </Text>
      <Text style={styles.phoneNumberText} className="text-center mt-1 mb-10">
        {phoneNumber}
      </Text>
      <View style={styles.otpContainer}>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={firstInput}
            onChangeText={text => {
              setOtp({...otp, 1: text});
              text && secondInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={secondInput}
            onChangeText={text => {
              setOtp({...otp, 2: text});
              text ? thirdInput.current.focus() : firstInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={thirdInput}
            onChangeText={text => {
              setOtp({...otp, 3: text});
              text ? fourthInput.current.focus() : secondInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={fourthInput}
            onChangeText={text => {
              setOtp({...otp, 4: text});
              text ? fifthInput.current.focus() : thirdInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={fifthInput}
            onChangeText={text => {
              setOtp({...otp, 5: text});
              text ? sixthInput.current.focus() : fourthInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={sixthInput}
            onChangeText={text => {
              setOtp({...otp, 6: text});
              !text && fifthInput.current.focus();
            }}
          />
        </View>
        {/* <OtpAutoFill
          onOtp={e => onOtpReceived(e)}
          style={{width: 0, height: 0}}
        /> */}
      </View>
      <View style={styles.timerContainer}>
        <TouchableOpacity
          style={[resendDisabled && styles.resendButtonDisabled]}
          onPress={handleResendOTP}
          disabled={resendDisabled}>
          <Text
            className="text-[#0095da] text-base font-bold mr-2"
            style={[resendDisabled && styles.resendButtonTextDisabled]}>
            إعادة الارسال
          </Text>
        </TouchableOpacity>
        <Text style={styles.timerText}>
          {resendDisabled ? `انتظر ${timer} ثانية` : 'لم تصلك الرسالة؟'}
        </Text>
      </View>

      {errorMessage !== '' && (
        <Text className="text-red-500 text-lg mt-5 mx-auto">
          {errorMessage}
        </Text>
      )}

      <TouchableOpacity
        style={styles.signinButton}
        className="h-[9%]"
        onPress={() => confirmCode()}>
        <Text style={styles.signinButtonText}>تأكيد الحساب</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver
        transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text className="text-black text-lg mb-2 text-center">
              جاري مراجعة البيانات المرسلة وسيتم التواصل معك خلال ٢٤ ساعة
            </Text>
            <TouchableOpacity
              onPress={handleModalButtonPress}
              className="w-[30%] h-12 rounded-xl mx-auto mt-5">
              <LinearGradient
                // Button Linear Gradient
                colors={['#e51978', '#a05193', '#4b63ac']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[0, 0.4, 1]}
                angle={45}
                className="w-full justify-center items-center rounded-lg mx-auto p-3 h-12">
                <Text
                  style={{fontSize: 18, fontWeight: 'bold'}}
                  className="text-center my-auto text-white">
                  حسناً
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={modalVisible2}
        onRequestClose={() => setModalVisible2(!modalVisible)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver
        transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text className="text-black text-lg mb-2">
              هل تريد ان يكون لديك اكثر من خط
            </Text>
            <Text className="text-black text-lg mb-2 mx-auto">
              صباحي + مسائي
            </Text>
            <View className="flex-row space-x-1">
              <TouchableOpacity
                onPress={() => {
                  setIsConfirmed(true);
                  setModalVisible2(false);
                }}
                className="w-24 h-12 rounded-xl mx-auto mt-5">
                <LinearGradient
                  // Button Linear Gradient
                  colors={['#e51978', '#a05193', '#4b63ac']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  locations={[0, 0.4, 1]}
                  angle={45}
                  className="w-24 justify-center items-center rounded-lg mx-auto p-3 h-12">
                  <Text
                    style={{fontSize: 18, fontWeight: 'bold'}}
                    className="text-center my-auto text-white">
                    نعم
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsConfirmed(false);
                  setModalVisible2(false);
                }}
                className="w-24 h-12 rounded-xl mx-auto mt-5">
                <LinearGradient
                  // Button Linear Gradient
                  colors={['#e51978', '#a05193', '#4b63ac']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  locations={[0, 0.4, 1]}
                  angle={45}
                  className="w-24 justify-center items-center rounded-lg mx-auto p-3 h-12">
                  <Text
                    style={{fontSize: 18, fontWeight: 'bold'}}
                    className="text-center my-auto text-white">
                    لا
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 20 * 1.4,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 20 * 1.4,
    marginTop: 50,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  content: {
    fontSize: 20,
    marginTop: 10,
    marginHorizontal: 20,
  },
  phoneNumberText: {
    fontSize: 18,
    lineHeight: 18 * 1.4,
    color: '#FBA83C',
  },
  otpContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  otpBox: {
    borderRadius: 5,
    borderColor: '#0095da',
    borderWidth: 0.5,
  },
  otpText: {
    fontSize: 25,
    color: '#0E122B',
    padding: 0,
    textAlign: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  signinButton: {
    backgroundColor: '#0095da',
    borderRadius: 8,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signinButtonText: {
    fontSize: 18,
    lineHeight: 18 * 1.4,
    color: '#FFFFFF',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  timerText: {
    fontSize: 18,
    color: '#9B9B9B',
    marginRight: 10,
  },
  resendButtonDisabled: {},
  resendButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  resendButtonTextDisabled: {
    color: '#9B9B9B',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00BCD4',
    padding: 25,
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#00BCD4',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    padding: 25,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default React.memo(VerificationScreen);
