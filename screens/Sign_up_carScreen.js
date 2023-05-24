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
import {useNavigation, useRoute} from '@react-navigation/native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const Sign_up_carScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    fullName,
    phoneNumber,
    password,
    signupoption,
    signinoption,
    locations,
    location,
    birthdate,
  } = route.params;
  const [cartype, setcartype] = useState('');
  const [cartypeError, setcartypeError] = useState('');
  const [carmodel, setcarmodel] = useState('');
  const [carmodelError, setcarmodelError] = useState('');
  const [deviceToken, setDeviceToken] = useState(null);
  const [carcolor, setcarcolor] = useState('');
  const [carcolorError, setcarcolorError] = useState('');
  const [carpassenger, setcarpassenger] = useState('');
  const [carpassengerError, setcarpassengerError] = useState('');
  const [carnumber, setcarnumber] = useState('');
  const [carnumberError, setcarnumberError] = useState('');
  const [carnumberword, setcarnumberword] = useState('');
  const [carnumberregion, setcarnumberregion] = useState('');
  const [carnumberregionError, setcarnumberregionError] = useState('');
  console.log(deviceToken);
  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  async function getToken() {
    const token = await messaging().getToken();
    if (token) {
      console.log('Device token:', token);
      setDeviceToken(token);
    } else {
      console.log('Failed to get the device token');
    }
  }

  const validatePasswords = () => {
    let isValid = true;

    if (cartype.trim().length === 0) {
      setcartypeError('يرجى ادخال نوع السيارة');
      isValid = false;
    } else {
      setcartypeError('');
    }

    if (carmodel.trim().length === 0) {
      setcarmodelError('يرجى ادخال موديل السيارة');
      isValid = false;
    } else {
      setcarmodelError('');
    }

    if (carcolor.trim().length === 0) {
      setcarcolorError('يرجى ادخال لون السيارة');
      isValid = false;
    } else {
      setcarcolorError('');
    }

    if (carpassenger.trim().length === 0) {
      setcarpassengerError('يرجى ادخال عدد الركاب المرافقين');
      isValid = false;
    } else {
      setcarpassengerError('');
    }

    if (carnumber.trim().length === 0) {
      setcarnumberError('يرجى ادخال رقم السيارة');
      isValid = false;
    } else {
      setcarnumberError('');
    }

    if (carnumberregion.trim().length === 0) {
      setcarnumberregionError('يرجى ادخال المحافظة للسيارة');
      isValid = false;
    } else {
      setcarnumberregionError('');
    }
    console.log(isValid);
    return isValid;
  };

  const handlecartype = useCallback(text => {
    setcartype(text);
  }, []);

  const handlecarmodel = useCallback(text => {
    setcarmodel(text);
  }, []);

  const handlecarcolor = useCallback(text => {
    setcarcolor(text);
  }, []);

  const handlecarpassenger = useCallback(text => {
    setcarpassenger(text);
  }, []);

  const handlecarnumber = useCallback(text => {
    setcarnumber(text);
  }, []);

  const handlecarnumberword = useCallback(text => {
    setcarnumberword(text);
  }, []);

  const handlecarnumberregion = useCallback(text => {
    setcarnumberregion(text);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={35} strokeWidth={2.5} color={'#a05193'} />
          <Text style={styles.backButtonText}>رجوع</Text>
        </Pressable>
        <Text className="mx-auto ml-10 text-2xl text-black font-bold mt-2">
          معلومات السيارة
        </Text>
      </View>

      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <ScrollView style={styles.scrollContainer}>
        <View className="flex flex-row w-[80%] mx-auto mt-5">
          <TextInput
            placeholder="نوع السيارة"
            value={cartype}
            required={true}
            onChangeText={handlecartype}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              cartypeError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
          {/* <View className="pr-2 mt-1">
          <AntDesign name="user" size={30} color={'#000'} />
          </View> */}
        </View>
        {cartypeError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {cartypeError}
          </Text>
        ) : null}

        <View className="flex flex-row w-[80%] mx-auto mt-3">
          <TextInput
            placeholder="موديل السيارة"
            required={true}
            value={carmodel}
            onChangeText={handlecarmodel}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              carmodelError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />

          {/* <View className="pr-2 mt-1">
          <Feather name="phone" size={30} color={'#000'} style={{fontWeight: '100'}} />
          </View> */}
        </View>
        {carmodelError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {carmodelError}
          </Text>
        ) : null}
        <View className="flex flex-row w-[80%] mx-auto mt-3">
          <TextInput
            placeholder="لون السيارة"
            value={carcolor}
            onChangeText={handlecarcolor}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              carcolorError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
        </View>
        {carcolorError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {carcolorError}
          </Text>
        ) : null}
        <View className="flex flex-row w-[80%] mx-auto mt-3">
          <TextInput
            placeholder="عدد الركاب المرافقين"
            keyboardType="numeric"
            required={true}
            value={carpassenger}
            onChangeText={handlecarpassenger}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              carpassengerError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
          {/* <View className="pr-2 mt-1">
            <KeyIcon size={30} className="" color={'#000'} />
          </View> */}
        </View>
        {carpassengerError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {carpassengerError}
          </Text>
        ) : null}
        <View className="flex flex-row w-[80%] mx-auto mt-3">
          <TextInput
            placeholder="المحافظة  "
            required={true}
            value={carnumberregion}
            onChangeText={handlecarnumberregion}
            className={`w-[30%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              carnumberregionError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
          <TextInput
            placeholder="الحرف لرقم السيارة ان وجد"
            required={true}
            value={carnumberword}
            onChangeText={handlecarnumberword}
            className={`w-[20%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
          <TextInput
            placeholder="رقم السيارة"
            keyboardType="numeric"
            required={true}
            value={carnumber}
            onChangeText={handlecarnumber}
            className={`w-[40%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              carnumberError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
          {/* <View className="pr-2 mt-1">
            <KeyIcon size={30} className="" color={'#000'} />
          </View> */}
        </View>
        {carnumberError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {carnumberError}
          </Text>
        ) : null}
        {/* <View className="flex flex-row w-[80%] mx-auto mt-3">
          <TextInput
            placeholder="الحرف لرقم السيارة ان وجد"
            required={true}
            value={carnumberword}
            onChangeText={handlecarnumberword}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          />
          {/* <View className="pr-2 mt-1">
            <KeyIcon size={30} className="" color={'#000'} />
          </View> */}
        {/* </View>
        <View className="flex flex-row w-[80%] mx-auto mt-3">
          <TextInput
            placeholder="المحافظة لرقم السيارة"
            required={true}
            value={carnumberregion}
            onChangeText={handlecarnumberregion}
            className={`w-[85%] border-b-2 border-gray-300 pb-2 text-xl font-bold text-gray-600 mx-auto focus:border-blue-400 h-10 ${
              carnumberregionError ? 'border-red-500' : ''
            }`}
            style={{textAlign: I18nManager.isRTL ? 'center' : 'center'}}
          /> */}
        {/* <View className="pr-2 mt-1">
            <KeyIcon size={30} className="" color={'#000'} />
          </View> */}
        {/* </View>  */}
        {carnumberregionError ? (
          <Text
            style={styles.errorText}
            className="text-red-500 text-xs mt-1 ml-5 mr-5">
            {carnumberregionError}
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            if (validatePasswords()) {
              navigation.navigate('Scan', {
                fullName,
                phoneNumber,
                password,
                signupoption,
                signinoption,
                locations,
                locationtitle: location,
                birthdate,
                deviceToken,
                cartype,
                carmodel,
                carcolor,
                carpassenger,
                carnumber,
                carnumberword,
                carnumberregion,
              });
            }
          }}
          // disabled={phoneNumberError !== ''}
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

export default React.memo(Sign_up_carScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    paddingHorizontal: 20,
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
