import React, {useCallback, useEffect, useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native'; // Add this line
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Image} from 'react-native';
import {LogBox} from 'react-native'; // Add this line
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, {PaginationLight} from 'react-native-x-carousel';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import RNSwipeVerify from 'react-native-swipe-verify';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LinearGradientImage from '../assets/button.png';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {LocationContext} from '../LocationContext'; // if you're using axios to make HTTP requests

const {width} = Dimensions.get('window');

const HomeScreen = props => {
  LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  const navigation = useNavigation();
  const [bannerAds, setBannerAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [carouselLoaded, setCarouselLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const [orderStatus, setOrderStatus] = useState(null);
  const [adImage, setAdImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasUnreadMessages2, setHasUnreadMessage2] = useState(false);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [isHandleStartRideCalled, setIsHandleStartRideCalled] = useState(false);
  const {startSendingLocation, stopSendingLocation} =
    useContext(LocationContext);

  const fetchUnreadMessages2 = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.get(
        'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/notifications/status',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );
      setHasUnreadMessage2(response.data.hasUnreadMessages);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUnreadMessages2();
    }, []),
  );

  const handleNotificationPress = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      await axios.put(
        'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/notifications/mark-read',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );
      setHasUnreadMessage2(false);
      navigation.navigate('Notification');
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal2 = () => {
    setShowModal(false);
  };
  const handleSwipeSuccess = useCallback(() => {
    setModalVisible(true);
  }, []);
  const closeModal = useCallback(() => {
    setModalVisible(false);
    this.swipeVerify2.reset();
  }, []);

  // const fetchOrderStatus = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('jwtToken');
  //     const response = await fetch(
  //       'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/check-order/homepage',
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `${token}`,
  //         },
  //       },
  //     );
  //     const data = await response.json();
  //     setOrderStatus(data.hasActiveOrder);
  //   } catch (error) {
  //     console.error('Error fetching order status:', error);
  //   }
  // };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // fetchOrderStatus();
    });

    // Clean up the subscription when the component is unmounted
    return unsubscribe;
  }, [navigation]);

  // Call fetchOrderStatus once on the initial page load
  useEffect(() => {
    // fetchOrderStatus();
  }, []);

  const fetchAdImage = async () => {
    try {
      const response = await fetch(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/image/ads2',
      );
      if (!response.ok) {
        throw new Error('Error fetching ad image');
      }
      const data = await response.json();
      const imageUrl = data.imageUrl;
      setAdImage(imageUrl || null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new notification arrived!', remoteMessage);
      // Perform custom actions here, such as showing an in-app alert or updating the UI
      // You can use any UI component to show the notification within your app
    });

    return () => {
      unsubscribe(); // Clean up the listener when the component is unmounted
    };
  }, []);

  const fetchBannerAds = async () => {
    try {
      const response = await fetch(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/ads-banner-captain',
      );
      if (!response.ok) {
        throw new Error('Error fetching banner ads');
      }
      const data = await response.json();
      setBannerAds(data);
      setLoading(false); // Add this line
      setCarouselLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const [userName, setUserName] = useState('');
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);

  const fetchUnreadMessages = async () => {
    const token = await AsyncStorage.getItem('jwtToken');

    axios
      .get(
        'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/messages/unread-exists',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      )
      .then(response => {
        setHasUnreadMessage(response.data);
      })
      // Catch any error here
      .catch(err => console.error(err));
  };

  useFocusEffect(
    useCallback(() => {
      fetchUnreadMessages();
    }, []),
  );

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response1 = await fetch(
        'https://zyvlz2xt17.execute-api.us-east-1.amazonaws.com/dev/api/user',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response1.ok) {
        throw new Error('Error fetching user data');
      }

      const data = await response1.json();
      setUserName(data.name);

      // Get the FCM token and send it to your API
      const fcmToken = await getToken();
      if (fcmToken) {
        const response = await fetch(
          'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/notification-token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
            body: JSON.stringify({
              token: fcmToken,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Error sending FCM token to server');
        }
        console.log('FCM token sent to server successfully');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchBannerAds();
    fetchAdImage(); // Fetch the ad image
  }, []);

  const getToken = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Authorization status:', authStatus);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async fcmToken => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await fetch(
          'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/notification-token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
            body: JSON.stringify({
              token: fcmToken,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Error updating FCM token on server');
        }
        console.log('FCM token updated on server successfully', response);
      } catch (error) {
        console.error(error);
      }
    });

    return unsubscribe;
  }, []);

  const handleStartRide = async () => {
    try {
      // Retrieve JWT token from AsyncStorage
      const token = await AsyncStorage.getItem('jwtToken');

      // Make the GET request to the API
      const response = await axios.get(
        'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/api/taxiOrders/captainLatestOrders',
        {
          headers: {Authorization: `${token}`},
        },
      );

      // Handle the response
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonPress = () => {
    if (!isHandleStartRideCalled) {
      setIsHandleStartRideCalled(true);
      handleStartRide();
    }
  };

  const renderItem = data => (
    <View key={data._id} className="flex justify-center items-center">
      <View className="rounded-2xl w-screen">
        <Image
          className="h-[100%] w-[90%] mx-auto rounded-2xl items-stretch"
          resizeMode="stretch"
          source={{uri: data.imageUrl}}
          onLoad={() => setImageLoaded(true)}
        />

        <View
          style={[
            styles.cornerLabel,
            {backgroundColor: data.cornerLabelColor},
          ]}>
          <Text style={styles.cornerLabelText}>{data.cornerLabelText}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 ml-auto w-screen h-screen bg-white">
      {/* <Text style={styles.text}>
        Welcome to Home
      </Text>
      <TouchableOpacity onPress={handleSignOutPress} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity> */}
      <View className="flex-row flex-[0.6]">
        <View className="flex flex-row mx-auto">
          <Text className=" mt-4 ml-10 text-xl font-bold text-black">
            مرحباً {userName} 👋🏻
          </Text>
        </View>
        <View className="mr-4 mt-3 w-10 h-10 justify-center items-center relative">
          <Ionicons
            name="notifications-outline"
            size={30}
            color={'#000'}
            onPress={() => {
              navigation.navigate('Notification');
              handleNotificationPress();
            }}
          />
          {hasUnreadMessages2 && (
            <View className="w-3 h-3 bg-red-500 rounded-full absolute top-0 right-2" />
          )}
        </View>
      </View>
      <View className="mt-2 flex-[2.4]">
        {carouselLoaded ? (
          <Carousel
            pagination={PaginationLight}
            renderItem={renderItem}
            data={bannerAds}
            loop
            autoplay
            containerStyle={styles.carouselContainer}
          />
        ) : (
          // Replace the View component with SkeletonPlaceholder
          <View className="mx-auto">
            <SkeletonPlaceholder>
              <SkeletonPlaceholder
                width={width * 0.9}
                height={width * 0.6}
                borderRadius={20}
              />
            </SkeletonPlaceholder>
          </View>
        )}
      </View>

      {/* second style */}

      <ScrollView className="flex flex-[4]">
        <View className="flex-row space-x-3 justify-between p-5">
          <TouchableOpacity
            onPress={() => {
              // if (!orderStatus) {
              //   setShowModal(true);
              //   return;
              // }
              navigation.navigate('CaptainInfo');
            }}
            className="bg-white w-[45%] h-28 sm:w-24 sm:h-24 rounded-xl flex flex-col justify-center items-center shadow-md shadow-black/70">
            <Image
              source={require('../assets/maps.png')}
              style={{width: '70%', height: '60%'}}
              resizeMode={'contain'}
            />
            <Text className="text-black text-2xl font-bold mt-1">رحلتي</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Wallet')}
            className="bg-white w-[45%] h-28 sm:w-24 sm:h-24 rounded-xl flex flex-col justify-center items-center shadow-md shadow-black/70">
            <Image
              source={require('../assets/wallet.png')}
              style={{width: '70%', height: '60%'}}
              resizeMode={'contain'}
            />
            <Text className="text-black text-2xl font-bold mt-1">المحفظة</Text>
          </TouchableOpacity>
        </View>
        <View className="w-[90%] mx-auto mb-5">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Order');
            }}
            className="bg-white w-full h-20 sm:w-24 sm:h-24 rounded-xl flex justify-between shadow-md shadow-black/70 flex-row items-center">
            <Image
              source={require('../assets/students.png')}
              style={{width: '40%', height: '100%'}}
              resizeMode={'contain'}
            />
            <Text className="text-black font-bold mt-1 mx-auto text-2xl">
              مشتركي خطي
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-[90%] mx-auto mt-0 flex-[0.1]">
          <LinearGradient
            className="h-[68px]"
            colors={
              isSwipeActive
                ? ['#e51978', '#a05193', '#4b63ac']
                : ['#cce3f2', '#e1d9ed', '#fccde3']
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.3, 1]}
            angle={45}
            style={{
              borderRadius: 30,
              overflow: 'hidden',
            }}>
            <RNSwipeVerify
              width={width - 50}
              buttonSize={60} // decrease button size
              buttonColor="#fff"
              backgroundColor="transparent"
              textColor="#fff"
              borderRadius={30}
              okButton={{visible: true, duration: 400}}
              ref={ref => (this.swipeVerify2 = ref)}
              onVerified={() => {
                // if (!orderStatus) {
                //   setShowModal(true);
                //   setModalVisible(false);
                //   this.swipeVerify2.reset();
                //   return;
                // }
                handleSwipeSuccess();
              }}
              icon={
                <Image
                  source={LinearGradientImage}
                  style={{width: 60, height: 60}}
                />
              }
              resetAfterSuccessAnim={true}
              containerStyle={
                {
                  // add container styles here
                }
              }
              iconContainerStyle={
                {
                  // add icon container styles here
                }
              }>
              <View style={styles.swipeTextContainer}>
                <Text
                  className={
                    isSwipeActive
                      ? 'text-white text-2xl font-bold'
                      : 'text-black text-2xl font-bold'
                  }>
                  {isSwipeActive ? 'انهاء الرحلة' : 'بدء الرحلة'}
                </Text>
              </View>
            </RNSwipeVerify>
          </LinearGradient>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {/* Add the content of the modal here */}
                  <Text className="text-black text-xl text-center mb-5">
                    هل انت متأكد ؟؟ سيتم ارسال اشعار للمشتركين بذلك
                  </Text>
                  <View className="flex-row space-x-3">
                    <LinearGradient
                      className="h-10 w-20 rounded-full items-center justify-center"
                      colors={['#e51978', '#a05193', '#4b63ac']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      locations={[0, 0.3, 1]}
                      angle={45}
                      style={{
                        borderRadius: 30,
                        overflow: 'hidden',
                      }}>
                      <TouchableOpacity
                        className="items-center justify-center h-10 w-20"
                        onPress={closeModal}>
                        <Text className="text-white text-lg text-center my-auto">
                          لا
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                      className="h-10 w-20 rounded-full items-center justify-center"
                      colors={['#e51978', '#a05193', '#4b63ac']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      locations={[0, 0.3, 1]}
                      angle={45}
                      style={{
                        borderRadius: 30,
                        overflow: 'hidden',
                      }}>
                      <TouchableOpacity
                        className="items-center justify-center h-10 w-20"
                        onPress={() => {
                          closeModal(); // Invoke the closeModal function
                          !isSwipeActive && startSendingLocation(); // Invoke the startSendingLocation function
                          !isSwipeActive && handleButtonPress(); // Call handleButtonPress
                          setIsSwipeActive(prevState => !prevState);
                          isSwipeActive && stopSendingLocation();
                        }}>
                        <Text className="text-white text-lg text-center my-auto">
                          نعم
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </ScrollView>
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text className="text-2xl text-black mb-5">
              ليس لديك اشتراك فعال لذلك اشترك اولاً
            </Text>
            <TouchableOpacity
              onPress={closeModal2}
              className="w-28 h-14 rounded-full mx-auto mb-2">
              <LinearGradient
                // Button Linear Gradient
                colors={['#e51978', '#a05193', '#4b63ac']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[0, 0.4, 1]}
                angle={45}
                className="w-full justify-center items-center rounded-full mx-auto p-3 h-14">
                <Text className="text-center my-auto text-white text-xl font-bold">
                  رجوع
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
// #e51978', '#a05193', '#4b63ac', '#365091
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 20,
  },
  carouselContainer: {
    width: width,
    aspectRatio: 1.5,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width,
    borderRadius: 20,
  },
  cardWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    // eslint-disable-next-line no-dupe-keys
    borderRadius: 20,
  },
  card: {
    width: width * 0.9,
    height: width * 0.6,
    resizeMode: 'stretch',
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  cornerLabel: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 8,
  },
  cornerLabelText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
  },
  carouselPlaceholder: {
    width: width * 0.9,
    height: width * 0.5,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  swipeText: {
    fontSize: 16, // decrease font size
    fontWeight: 'bold', // increase font weight
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default React.memo(HomeScreen);
