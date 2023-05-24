import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

const EditUserDataScreen = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const borderAnim = useRef(new Animated.Value(0)).current;
  const {key, title, initialValue} = route.params;
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const genderData = ['ذكر', 'أنثى'];
  const typeData = ['موظف', 'طالب'];

  const arabicToEnglish = {
    ذكر: 'male',
    أنثى: 'female',
    موظف: 'employee',
    طالب: 'student',
  };

  const [confirm, setConfirm] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handlePhoneNumberVerification = async () => {
    setIsLoading(true);
    const confirmation = await auth().signInWithPhoneNumber(`+964${value}`);
    setIsLoading(false);
    navigation.navigate('OTPchangephone', {
      phoneNumber: value,
      confirm: confirmation,
    });
  };

  const handleConfirmVerification = async () => {
    setIsLoading(true);
    try {
      await confirm.confirm(otpCode);
      Alert.alert('Phone number confirmed successfully');
      handleSave();
    } catch (error) {
      Alert.alert('Invalid code');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);

    if (key === 'phonenumber') {
      if (isVerifying) {
        try {
          await confirm.confirm(otpCode);
          Alert.alert('Phone number confirmed successfully');
        } catch (error) {
          setIsLoading(false);
          Alert.alert('Invalid code');
          return;
        }
      } else {
        handlePhoneNumberVerification();
        return;
      }
    }

    const token = await AsyncStorage.getItem('jwtToken');
    const response = await fetch(
      'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/users/update',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          [key]: arabicToEnglish[value] || value,
        }),
      },
    );

    setIsLoading(false);

    if (!response.ok) {
      throw new Error('Error updating user data');
    }

    if (props.route.params.onUpdate) {
      props.route.params.onUpdate();
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.content}>
        <Text style={styles.title}>حدث {title}</Text>
        <View style={styles.inputContainer}>
          {title === 'الجنس' ? (
            <SelectDropdown
              data={genderData}
              onSelect={(selectedItem, index) => {
                setValue(selectedItem);
              }}
              defaultValue={value}
              renderDropdownIcon={() => (
                <Icon name="chevron-down" size={20} color="#1F2937" />
              )}
              dropdownIconPosition="right"
              dropdownStyle={{width: '90%'}}
              buttonStyle={styles.dropdownButton}
              defaultButtonText={'اختر الجنس'}
            />
          ) : title === 'النوع' ? (
            <SelectDropdown
              data={typeData}
              onSelect={(selectedItem, index) => {
                setValue(selectedItem);
              }}
              defaultValue={value}
              renderDropdownIcon={() => (
                <Icon name="chevron-down" size={20} color="#1F2937" />
              )}
              dropdownIconPosition="right"
              dropdownStyle={{width: '90%'}}
              buttonStyle={styles.dropdownButton}
              defaultButtonText={'اختر المهنة'}
            />
          ) : title === 'Password' ? (
            <TextInput
              secureTextEntry
              value={value}
              onChangeText={text => setValue(text)}
              className="text-right font-extrabold text-lg"
              placeholder="كلمة السر الجديدة"
            />
          ) : title === 'رقم الهاتف' ? (
            <TextInput
              value={value}
              onChangeText={text => setValue(text)}
              style={styles.input}
            />
          ) : (
            <TextInput
              value={value}
              onChangeText={text => setValue(text)}
              style={styles.input}
            />
          )}
          <Animated.View
            style={[
              styles.borderBottom,
              {
                width: borderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <TouchableOpacity
          className="w-[50%] h-10 mx-auto mt-auto mb-10"
          onPress={handleSave}
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
                حفظ
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  backButton: {
    margin: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 40,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  input: {
    height: 40,
    fontSize: 18,
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#F3F4F6',
    fontSize: 18,
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: '#1F2937',
  },
  dropdownButton: {
    width: '100%',
  },
  verifyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#F3F4F6',
    fontSize: 18,
  },
});

export default React.memo(EditUserDataScreen);
