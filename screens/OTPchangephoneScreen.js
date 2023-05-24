import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';

const OTPchangephoneScreen = ({navigation, route}) => {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {phoneNumber, confirm} = route.params;

  const verifyOTP = async () => {
    setIsLoading(true);

    try {
      await confirm.confirm(otpCode);
      Alert.alert('تم التأكيد بنجاح');
      navigation.navigate('UserData');
    } catch (error) {
      Alert.alert('الرمز الذي ادخلتة خاطئ');
    }

    setIsLoading(false);
  };

  return (
    <>
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
      <View className="flex flex-col justify-center items-center h-[90%] bg-gray-100">
        <TextInput
          value={otpCode}
          onChangeText={setOtpCode}
          placeholder="ادخل الرمز الذي وصلك"
          className="w-3/4 p-4 mb-4 bg-white rounded border text-right border-gray-300 shadow"
        />

        <TouchableOpacity
          className="mt-2 w-[50%] h-10 mx-auto"
          onPress={verifyOTP}
          disabled={isLoading}>
          <LinearGradient
            colors={['#4b63ac', '#a05193', '#e51978']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.5, 1]}
            angle={45}
            className="h-12 rounded-full">
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                className="my-auto"
              />
            ) : (
              <Text className="text-center my-auto text-xl font-bold text-white">
                تأكيد
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default OTPchangephoneScreen;
