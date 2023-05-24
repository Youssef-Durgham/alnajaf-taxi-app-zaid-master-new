import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const PhoneInviteNumberScreen = ({route}) => {
  const {
    fromlat,
    fromlong,
    taxiType,
    typeOfWork,
    daysOfWork,
    tolocation,
    genderType,
  } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (isTouched) {
      checkPhoneNumber(phoneNumber);
    }
  }, [isTouched, phoneNumber]);

  const checkPhoneNumber = async phoneNumber => {
    try {
      const response = await fetch(
        `https://zyvlz2xt17.execute-api.us-east-1.amazonaws.com/dev/phone/users/check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phonenumber: phoneNumber,
            method: 'phone',
          }),
        },
      );
      const data = await response.json();
      setIsPhoneValid(data.exists);
      if (!data.exists) {
        setErrorMessage('Phone number not found');
      } else {
        setErrorMessage('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigateToVerifyInfo = () => {
    navigation.navigate('VerifyInfo', {
      tolocation,
      phoneNumber,
      fromlat,
      fromlong,
      taxiType,
      typeOfWork,
      daysOfWork,
      genderType,
    });
  };

  const handleNavigateWithoutPhoneNumber = () => {
    navigation.navigate('VerifyInfo', {
      tolocation,
      fromlat,
      fromlong,
      taxiType,
      typeOfWork,
      daysOfWork,
      genderType,
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View className="my-auto">
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            paddingHorizontal: 10,
            margin: 10,
          }}
          className="rounded-xl"
          onChangeText={setPhoneNumber}
          value={phoneNumber}
          keyboardType="phone-pad"
          placeholder="ادخل رقم هاتف الشخص الذي دعاك للتطبيق"
          onFocus={() => setIsTouched(true)}
        />
        {isTouched && errorMessage ? (
          <Text style={{color: 'red', margin: 10}}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity
          onPress={handleNavigateToVerifyInfo}
          disabled={!isPhoneValid}
          style={{
            backgroundColor: isPhoneValid ? '#e51978' : '#ccc',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            alignSelf: 'center',
            marginBottom: 10,
          }}
          className="mt-7">
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
            التأكيد والمتابعة
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNavigateWithoutPhoneNumber}
          style={{
            backgroundColor: '#e51978',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            alignSelf: 'center',
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
            لم يقم احد بدعوتي للتطبيق
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(PhoneInviteNumberScreen);
