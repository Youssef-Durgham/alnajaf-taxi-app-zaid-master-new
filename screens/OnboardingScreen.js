import {
  View,
  Text,
  Image,
  Pressable,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {Platform} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

async function requestNotificationPermission() {
  try {
    const {status} = await checkNotifications();
    if (status === 'denied') {
      console.log('Notification permission denied');
    } else if (status === 'blocked') {
      console.log('Notification permission blocked');
    } else {
      const {status} = await requestNotifications(['alert', 'sound']);
      if (status === 'granted') {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
}

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const modalizeRef = useRef(null);
  const [deviceToken, setDeviceToken] = useState(null);
  useEffect(() => {
    requestNotificationPermission(); // Call the function in the useEffect hook
  }, []);

  useEffect(() => {
    requestUserPermission();
    getTokenAndSendToAPI();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async function getTokenAndSendToAPI() {
    let token;
    if (messaging().isDeviceRegisteredForRemoteMessages) {
      token = await messaging().getToken();
    }
    if (token) {
      console.log('Device token:', token);
      setDeviceToken(token);

      // Send the token to the API
      try {
        const response = await axios.post(
          'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/notification-token',
          {
            token,
          },
        );
        console.log(response.data.message);
      } catch (error) {
        console.error('Error sending the device token to the server:', error);
      }
    } else {
      console.log('Failed to get the device token');
    }
  }

  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'موقع الهاتف',
            message: 'يرجى السماح بالوصول إلى موقع هاتفك',
            buttonNeutral: 'سماح',
            buttonNegative: 'إلغاء',
            buttonPositive: 'موافق',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            async position => {
              await AsyncStorage.setItem(
                'userLocation',
                JSON.stringify(position.coords),
              );
            },
            error => {
              console.log(error.code, error.message);
              alert('حدث خطأ أثناء الحصول على موقعك الحالي');
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
            },
          );
        } else {
          alert('يرجى تفعيل خدمات الموقع لديك من إعدادات الجهاز');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestLocationPermission();
  }, []);

  const myImage = require('../assets/logo.png');
  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const handleClose = () => {
    if (modalizeRef.current) {
      modalizeRef.current.close();
    }
  };

  (async () => {
    const status = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

    if (status !== RESULTS.GRANTED) {
      const newStatus = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      console.log(newStatus);
    }
  })();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="justify-center items-center my-auto">
        <Image
          source={require('../assets/logo.png')}
          className="w-40 h-40 -mt-20"
        />
        <Text className="text-2xl font-semibold text-[#1f1b1c]">خطي</Text>
        <View className="flex flex-col space-y-3">
          <LinearGradient
            // Button Linear Gradient
            colors={['#e51978', '#a05193', '#4b63ac']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.4, 1]}
            angle={45}
            className="h-14 w-40 rounded-full mt-16">
            <Pressable
              className="h-14 w-40 rounded-full"
              onPress={() => navigation.navigate('Sign_in')}>
              <Text className="text-center my-auto text-white font-semibold text-lg">
                تسجيل الدخول
              </Text>
            </Pressable>
          </LinearGradient>
          <LinearGradient
            // Button Linear Gradient
            colors={['#e51978', '#a05193', '#4b63ac']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.4, 1]}
            angle={45}
            className="h-14 w-40 rounded-full">
            <Pressable
              className="h-14 w-40 rounded-full"
              onPress={() => navigation.navigate('Sign_up')}>
              <Text className="text-center my-auto text-white font-semibold text-lg">
                إنشاء حساب
              </Text>
            </Pressable>
          </LinearGradient>
        </View>
      </View>
      {/* <View style={styles.imageContainer} className="mt-20 w-[50%] mx-auto">
        <ImageBackground
          source={myImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>
      <View className="absolute top-5 self-center">
        <Text className="font-bold text-xl text-black">
          مرحباً بك في خطي 👋🏻
        </Text>
      </View>
      <View className="flex-1 justify-center items-center bg-white">
        <View className="mt-auto mb-10">
          <Text className="text-4xl font-bold text-center text-black">
            رحلتك الامنة والمريحة في متناول يدك
          </Text>
        </View>
        <TouchableOpacity
          className="bg-black mb-9 w-[90%] h-12 rounded-full justify-center"
          onPress={() => onOpen()}>
          <LinearGradient
            // Button Linear Gradient
            colors={['#e51978', '#a05193', '#4b63ac']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.4, 1]}
            angle={45}
            className="h-14 rounded-full">
            <Text className="text-2xl font-bold text-white text-center my-auto">
              هيا بنا!
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Modalize
        ref={modalizeRef}
        modalHeight={screenHeight * 0.5}
        threshold={100}
        closeOnOverlayTap={true}
        onClose={() => console.log('Modal closed')}
        onOpened={() => console.log('Modal opened')}
        onPositionChange={position => {
          if (position === 'bottom') {
            handleClose();
          }
        }}
        // snapPoint={150}
        modalHeight={250}
        withHandle={true} // Add this line
      >
        <View className="h-[250px] justify-center items-center space-y-5">
          <TouchableOpacity
            className="bg-black w-[90%] h-14 rounded-full justify-center"
            onPress={() => navigation.navigate('Sign_up')}>
            <LinearGradient
              // Button Linear Gradient
              colors={['#e51978', '#a05193', '#4b63ac']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.4, 1]}
              angle={45}
              className="h-14 rounded-full">
              <Text className="text-white font-bold text-xl text-center my-auto">
                انشاء الحساب
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-black w-[90%] h-14 rounded-full justify-center"
            onPress={() => navigation.navigate('Sign_in')}>
            <LinearGradient
              // Button Linear Gradient
              colors={['#e51978', '#a05193', '#4b63ac']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.4, 1]}
              angle={45}
              className="h-14 rounded-full">
              <Text className="text-white font-bold text-xl text-center my-auto">
                تسجيل الدخول
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modalize> */}
    </SafeAreaView>
  );
};

export default React.memo(OnboardingScreen);
