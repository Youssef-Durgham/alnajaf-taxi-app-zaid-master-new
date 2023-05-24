import {View, Text, TextInput, ActivityIndicator, Modal} from 'react-native';
import React, {useState} from 'react';
import {FingerPrintIcon, XCircleIcon} from 'react-native-heroicons/mini';
import {SafeAreaView, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {I18nManager} from 'react-native';
import {StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  KeyIcon,
  PhoneIcon,
  ChevronLeftIcon,
} from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {KeyboardAvoidingView} from 'react-native';
import {Button} from 'react-native';

const Sign_inScreen = props => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const translateErrorMessage = message => {
    console.log(message);
    const translations = {
      'Phone number not found': 'رقم الهاتف غير موجود',
      'Password is incorrect': 'رمز المرور خاطئ',
      'Account not yet verified by admin.':
        ' الرجاء الانتظار 24 ساعة حتى يتم التحقق من حسابك',
    };

    return translations[message] || 'شيء ما خاطيء الرجاء المحاولة ثانية';
  };

  const handleSignIn = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/phone/signin/captain',
        {
          phonenumber: phoneNumber,
          password,
        },
      );
      console.log(response.data);
      if (response.data.message === 'Account not yet verified by admin.') {
        setModalVisible(true);
      } else if (response.data) {
        await AsyncStorage.setItem('jwtToken', response.data.token);
        props.route.params.onSignIn(response.data.token);
      } else {
        console.log(response.data.message);
        setPasswordError(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        if (error.response.data.message === 'Phone number not found') {
          setPhoneNumberError('رقم الهاتف غير موجود');
        } else {
          setPasswordError(translateErrorMessage(error.response.data.message));
        }
      } else {
        console.log(error);
        setPasswordError('شيء ما خاطيء الرجاء المحاولة ثانية');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = text => {
    // Remove non-digit characters from the phone number input
    const cleanedPhoneNumber = text.replace(/\D/g, '');

    // Update the phone number state with the cleaned input
    setPhoneNumber(cleanedPhoneNumber);

    // Check if the cleaned phone number has a length of at least 11 digits
    if (cleanedPhoneNumber.length < 11) {
      setPhoneNumberError('يجب أن يتكون رقم الهاتف من 11 رقمًا على الأقل');
    } else {
      setPhoneNumberError('');
    }
  };

  const handlePasswordChange = text => {
    setPassword(text);
  };

  const validatePasswords = () => {
    let isValid = true;

    if (password.trim().length === 0) {
      setPasswordError('يرجى ادخال رمز المرور');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (phoneNumber.trim().length === 0) {
      setPhoneNumberError('يرجى ادخال رقم الهاتف');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }

    return isValid;
  };

  return (
    <SafeAreaView className="bg-[#fff] h-screen flex-1">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              الرجاء الانتظار 24 ساعة حتى يتم التحقق من حسابك
            </Text>
            <Button
              onPress={() => setModalVisible(false)}
              title="حسنًا"
              color="#841584"
            />
          </View>
        </View>
      </Modal>
      <Pressable
        className="mt-5 ml-4 w-20 flex-row"
        onPress={() => navigation.goBack()}>
        <ChevronLeftIcon
          size={35}
          className="font-semibold"
          strokeWidth={2.5}
          color={'#a05193'}
        />
        <Text className="text-xl font-bold -ml-1 mt-0.5 text-[#a05193]">
          رجوع
        </Text>
      </Pressable>
      <Text className="mx-auto text-2xl font-bold mt-32ﬁ‹ text-black">
        تسجيل الدخول
      </Text>

      <View className="flex flex-row w-[80%] mx-auto mt-10">
        <TextInput
          placeholder="رقم الهاتف"
          keyboardType="phone-pad"
          autoCompleteType="tel"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
            phoneNumberError ? 'border-red-500' : ''
          }`}
          style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
        />
      </View>
      {phoneNumberError ? (
        <Text className="text-red-500 text-xs mt-1 ml-5 pr-5 pl-5">
          {phoneNumberError}
        </Text>
      ) : null}
      <View className="flex flex-row w-[80%] mx-auto mt-10">
        <TextInput
          placeholder="رمز المرور"
          secureTextEntry
          required={true}
          value={password}
          onChangeText={handlePasswordChange}
          className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
            passwordError ? 'border-red-500' : ''
          }`}
          style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
        />
      </View>
      {passwordError ? (
        <Text className="text-red-500 text-small mt-1 ml-5 pl-5 w-[80%]">
          {passwordError}
        </Text>
      ) : null}

      <Pressable
        disabled={loading}
        onPress={async () => {
          if (validatePasswords() && !loading) {
            handleSignIn();
          }
        }}>
        <LinearGradient
          colors={['#e51978', '#a05193', '#4b63ac']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          locations={[0, 0.3, 1]}
          angle={45}
          style={({pressed}) => [
            {
              backgroundColor: pressed ? '#ddd' : '#0d6efd',
            },
            styles.button,
          ]}
          className="w-28 h-12 justify-center items-center mx-auto rounded-xl mt-10">
          <Text style={styles.buttonText}>
            {loading ? (
              <ActivityIndicator size="small" color="#3498db" />
            ) : (
              ' تسجيل الدخول'
            )}
          </Text>
        </LinearGradient>
      </Pressable>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View className="flex flex-row mt-5 justify-between">
          <Pressable className="ml-4 w-9" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={40} color={'#000'} />
          </Pressable>
          <Pressable
            className="mr-4 border border-slate-300 rounded-full h-10 p-2 justify-center items-center"
            onPress={() => navigation.navigate('Sign_up')}>
            <Text className="text-black font-bold">تسجيل الدخول</Text>
          </Pressable>
        </View>
        <Text className="text-4xl font-bold mt-5 text-black mr-6">
          اهلاً برجوعك 👋🏻
        </Text>
        <Text className="text-lg font-bold mt-1 text-gray-600 mr-6">
          نحن متحمسين جداً لرؤيتك من جديد
        </Text>

        <View style={{height: 400}}>
          <View className="flex flex-row w-screen mt-10">
            <TextInput
              placeholder="رقم الهاتف"
              keyboardType="phone-pad"
              autoCompleteType="tel"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              className={`w-[90%] border rounded-full border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-12 ${
                phoneNumberError ? 'border-red-500' : ''
              } px-4`}
              style={{textAlign: I18nManager.isRTL ? 'left' : 'right'}}
            />
          </View>
          {phoneNumberError ? (
            <Text className="text-red-500 text-xs mt-1 ml-5 pr-5 pl-5">
              {phoneNumberError}
            </Text>
          ) : null}
          <View className="flex flex-row w-screen mt-5">
            <TextInput
              placeholder="رمز المرور"
              secureTextEntry
              required={true}
              value={password}
              onChangeText={handlePasswordChange}
              className={`w-[90%] border rounded-full border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-12 ${
                passwordError ? 'border-red-500' : ''
              } px-4`}
              style={{textAlign: I18nManager.isRTL ? 'left' : 'right'}}
            />
          </View>
          {passwordError ? (
            <Text className="text-red-500 text-xs mt-1 ml-5 pr-5 pl-5">
              {passwordError}
            </Text>
          ) : null}
        </View>

        <Pressable
          onPress={async () => {
            if (validatePasswords() && !loading) {
              handleSignIn();
            }
          }}
          className="w-[90%] h-12 justify-center items-center mx-auto rounded-full mt-auto mb-10 bg-black">
          <LinearGradient
            colors={['#e51978', '#a05193', '#4b63ac']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.3, 1]}
            angle={45}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? '#ddd' : '#0d6efd',
              },
              styles.button,
            ]}
            className="w-full h-12 justify-center items-center mx-auto rounded-full">
            <Text style={styles.buttonText}>تسجيل الدخول</Text>
          </LinearGradient>
        </Pressable>
      </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default React.memo(Sign_inScreen);

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
