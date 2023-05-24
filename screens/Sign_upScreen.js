import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  I18nManager,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {Image} from 'react-native';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';

async function requestUserPermission() {
  // Add your code for requesting user permission here
}

const Sign_upScreen = ({locations}) => {
  const navigation = useNavigation();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [location, setLocation] = useState('');
  const [Nearlocation, setNearLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [NearlocationError, setNearlocationError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = selectedDate => {
    setBirthdate(selectedDate);
  };

  const handleOK = () => {
    // Close the date picker and perform any necessary actions
    setShowDatePicker(false);
    // Additional logic if needed
  };

  const handleCancel = () => {
    // Close the date picker without selecting a date
    setShowDatePicker(false);
    // Additional logic if needed
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const signupoption = true;
  const signinoption = false;

  const handleFullNameChange = useCallback(text => {
    setFullName(text);
  }, []);

  useEffect(() => {
    requestUserPermission();
    // getToken(); // You can add your logic for getting the device token here
  }, []);

  const handlePhoneNumberChange = useCallback(text => {
    // Remove non-digit characters from the phone number input
    const cleanedPhoneNumber = text.replace(/\D/g, '');

    // Update the phone number state with the cleaned input
    setPhoneNumber(cleanedPhoneNumber);
  }, []);

  const handlePasswordChange = useCallback(text => {
    setPassword(text);
  }, []);

  const handleConfirmPasswordChange = useCallback(text => {
    setConfirmPassword(text);
  }, []);

  const validatePasswords = () => {
    let isValid = true;

    if (password.trim().length === 0) {
      setPasswordError('يرجى ادخال رمز المرور');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (confirmPassword.trim().length === 0) {
      setConfirmPasswordError('يرجى ادخال تأكيد رمز المرور');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('يجب ان يتطابق تأكيد رمز المرور مع رمز المرور');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (fullName.trim().length === 0) {
      setFullNameError('يرجى ادخال الاسم الكامل');
      isValid = false;
    } else {
      setFullNameError('');
    }

    if (phoneNumber.trim().length === 0) {
      setPhoneNumberError('يرجى ادخال رقم الهاتف');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }

    if (!termsAccepted) {
      setTermsError('يجب الموافقة على الشروط والأحكام');
      isValid = false;
    } else {
      setTermsError('');
    }

    if (location.trim().length === 0) {
      setLocationError('يرجى ادخال الموقع');
      isValid = false;
    } else {
      setLocationError('');
    }

    if (Nearlocation.trim().length === 0) {
      setNearLocation('يرجى ادخال اقرب نقطة دالة');
      isValid = false;
    } else {
      setNearLocation('');
    }

    if (birthdate.toLocaleDateString().trim().length === 0) {
      setBirthdateError('يرجى ادخال تاريخ الميلاد');
      isValid = false;
    } else {
      setBirthdateError('');
    }

    return isValid;
  };

  const handleLocationChange = useCallback(text => {
    setLocation(text);
  }, []);

  const handleNearLocationChange = useCallback(text => {
    setNearLocation(text);
  }, []);
  console.log(birthdate);
  return (
    <SafeAreaView style={styles.container}>
      

      {/* <Image source={require('../assets/logo.png')} style={styles.logo} /> */}
      <ScrollView style={styles.scrollContainer}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={35} strokeWidth={2.5} color={'#a05193'} />
          <Text style={styles.backButtonText}>رجوع</Text>
        </Pressable>
        <Text className="mx-auto ml-10 text-2xl text-black font-bold mt-2">المعلومات الشخصية</Text>
      </View>
        <View className="flex flex-row w-[80%] mx-auto mt-5">
          <TextInput
            placeholder="الاسم الثلاثي"
            value={fullName}
            required={true}
            onChangeText={handleFullNameChange}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              fullNameError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
          {/* <View className="pr-2 mt-1">
          <AntDesign name="user" size={30} color={'#000'} />
          </View> */}
        </View>
        {fullNameError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {fullNameError}
          </Text>
        ) : null}

        <View className="flex flex-row w-[80%] mx-auto mt-3">
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

          {/* <View className="pr-2 mt-1">
          <Feather name="phone" size={30} color={'#000'} style={{fontWeight: '100'}} />
          </View> */}
        </View>
        {phoneNumberError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {phoneNumberError}
          </Text>
        ) : null}
        <View className="flex flex-row w-[80%] mx-auto mt-3">
          <TextInput
            placeholder="العنوان"
            value={location}
            onChangeText={handleLocationChange}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              locationError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
        </View>
        {locationError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {locationError}
          </Text>
        ) : null}
        <View className="flex flex-row w-[80%] mx-auto mt-3">
          <TextInput
            placeholder="اقرب نقطة دالة"
            value={Nearlocation}
            onChangeText={handleNearLocationChange}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              NearlocationError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
        </View>
        {NearlocationError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {NearlocationError}
          </Text>
        ) : null}
        <View className="flex flex-row w-[80%] mx-auto mt-3">
          <TextInput
            placeholder="كلمة المرور"
            secureTextEntry
            required={true}
            value={password}
            onChangeText={handlePasswordChange}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              passwordError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
          {/* <View className="pr-2 mt-1">
            <KeyIcon size={30} className="" color={'#000'} />
          </View> */}
        </View>
        {passwordError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {passwordError}
          </Text>
        ) : null}
        <View className="flex flex-row w-[80%] mx-auto mt-3">
          <TextInput
            placeholder="تأكيد كلمة المرور"
            secureTextEntry
            required={true}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              confirmPasswordError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
          {/* <View className="pr-2 mt-1">
            <KeyIcon size={30} className="" color={'#000'} />
          </View> */}
        </View>
        {confirmPasswordError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {confirmPasswordError}
          </Text>
        ) : null}

        <View className="flex flex-row w-[80%] mt-5 mb-2 mx-auto">
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
            className="mx-auto">
            <Text className="w-36 text-center text-xl text-black">
              {birthdate !== ''
                ? birthdate.toLocaleDateString()
                : 'اختر تاريخ الميلاد'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <>
            <View style={styles.overlay} />
            <View className="z-50 bg-white drop-shadow-2xl shadow-2xl shadow-black rounded-xl">
              <View className=" flex-row justify-between pl-5 pr-5 pt-1 border-b border-gray-500 h-10">
                <TouchableOpacity onPress={handleCancel}>
                  <Text className="text-black text-lg">اغلاق</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOK}>
                  <Text className="text-black text-lg">اتمام</Text>
                </TouchableOpacity>
              </View>

              <DatePicker
                date={birthdate}
                mode="date"
                onDateChange={handleDateChange}
                className="mx-auto"
              />
            </View>
          </>
        )}

        {birthdateError ? (
          <Text style={styles.errorText}>{birthdateError}</Text>
        ) : null}

        <View style={styles.checkboxContainer} className="mx-auto">
          <TouchableOpacity
            style={styles.checkboxButton}
            onPress={() => setTermsAccepted(!termsAccepted)}>
            <View
              style={[
                styles.checkbox,
                {borderColor: '#6B7280'},
                termsAccepted ? styles.checkboxActive : null,
              ]}>
              {termsAccepted && <View style={styles.checkboxInner} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('TermsAndConditions')}>
            <Text style={styles.termsText}>
              أوافق على
              <Text style={styles.termsLink}>{' الشروط والأحكام '}</Text>
            </Text>
          </TouchableOpacity>
        </View>
        {termsError ? <Text style={styles.errorText}>{termsError}</Text> : null}

        <TouchableOpacity
          onPress={() => {
            if (validatePasswords() && phoneNumberError === '') {
              navigation.navigate('Sign_up_car', {
                fullName,
                phoneNumber,
                password,
                signupoption,
                signinoption,
                locations,
                location,
                birthdate,
              });
            }
          }}
          disabled={phoneNumberError !== ''}
          style={styles.nextButton}
          className="w-32">
          <LinearGradient
            colors={['#e51978', '#a05193', '#4b63ac']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.3, 1]}
            angle={45}
            style={styles.gradient}>
            <Text style={styles.buttonText}>التالي</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(Sign_upScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the opacity (0.5) as desired
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 5,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a05193',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    paddingBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    marginBottom: 10,
  },
  inputError: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    width: '80%',
  },

  datePickerContainer: {
    marginBottom: 10,
  },
  datePickerButton: {
    height: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 5,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  datePicker: {
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxButton: {
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#0d6efd',
    borderRadius: 2,
  },
  checkboxActive: {
    borderColor: '#6B7280',
  },
  termsText: {
    fontSize: 14,
    color: 'gray',
  },
  termsLink: {
    color: '#0d6efd',
    textDecorationLine: 'underline',
  },
  nextButton: {
    marginVertical: 20,
    alignSelf: 'center',
  },
  gradient: {
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
