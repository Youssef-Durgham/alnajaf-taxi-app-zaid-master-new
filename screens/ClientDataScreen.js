import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  Pressable,
  ImageBackground,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Modal,
} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {Rating, AirbnbRating} from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';
import jwtDecode from 'jwt-decode';
import CustomRating from '../components/CustomRating';

const ClientDataScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {data} = route.params; // Get the data object from the route parameters
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [imageLoading, setImageLoading] = useState(false); // Add image loading state
  const [captainData, setCaptainData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [captainAverageRating, setCaptainAverageRating] = useState(0);
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isPaymentModalVisible2, setPaymentModalVisible2] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentModalMessage, setPaymentModalMessage] = useState('');

  console.log(data);
  const handleImageLoadStart = () => {
    setImageLoading(true);
  };

  const handleImageLoadEnd = () => {
    setImageLoading(false);
  };

  const handleCallButtonPress = () => {
    if (data.phonenumber) {
      Linking.openURL(`tel:${data.phonenumber}`);
    }
  };

  const getAverageRating = async captainId => {
    try {
      const averageRatingResponse = await axios.get(
        `https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/captainRating/${captainId}`,
      );
      setCaptainAverageRating(averageRatingResponse.data.averageRating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };
  const handleAcceptPayment = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.post(
        `https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/acceptOrder-captain`,
        {id: data.id},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );

      setPaymentStatus(response);

      switch (response.status) {
        case 200:
          setPaymentModalVisible2(true);
          setPaymentModalMessage('تم تأكيد الدفع لهذا الشهر');
          break;
        case 201:
          setPaymentModalVisible2(true);
          setPaymentModalMessage('لم يتم الدفع بعد');
          break;
        case 202:
          setPaymentModalVisible2(true);
          setPaymentModalMessage('المستخدم دفع بالفعل في هذا الشهر');
          break;
        default:
          console.error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error accepting payment:', error);
      setPaymentError(error);
    }
  };

  // this function will be called when the 'معالجة الدفع' button is clicked
  const handlePaymentButtonClick = () => {
    setPaymentModalVisible(true);
  };
  const PaymentModal = ({visible, onRequestClose, onAccept}) => {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 20,
              // other styles
            }}>
            <Text className="text-2xl mx-auto text-center text-black">
              هل أنت متأكد من أنك تريد قبول الدفع؟
            </Text>
            <Text className="mx-auto text-xl text-black mt-3">
              مبلغ الاشتراك : {Intl.NumberFormat('EN').format(data.cost)} IQD
            </Text>
            <View className="flex-row mx-auto space-x-5 mt-5">
              <TouchableOpacity
                onPress={onAccept}
                style={{
                  backgroundColor: '#4b63ac',
                  borderRadius: 10,
                  alignItems: 'center',
                }}
                className="h-12 w-[40%] rounded-full mb-3">
                <LinearGradient
                  // Button Linear Gradient
                  colors={['#4b63ac', '#a05193', '#e51978']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  locations={[0, 0.5, 1]}
                  angle={45}
                  className="rounded-full"
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{color: 'white', fontWeight: 'bold'}}
                    className="text-xl">
                    تأكيد
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onRequestClose}
                style={{
                  backgroundColor: '#4b63ac',
                  borderRadius: 10,
                  alignItems: 'center',
                }}
                className="h-12 w-[40%] rounded-full">
                <LinearGradient
                  // Button Linear Gradient
                  colors={['#4b63ac', '#a05193', '#e51978']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  locations={[0, 0.5, 1]}
                  angle={45}
                  className="rounded-full"
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{color: 'white', fontWeight: 'bold'}}
                    className="text-xl">
                    إلغاء
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    if (data && data.id) {
      getAverageRating(data.id);
    }
  }, [data]);

  const openRatingModal = async () => {
    if (!isOpeningModal) {
      setIsOpeningModal(true);
      const token = await AsyncStorage.getItem('jwtToken');
      const decodedToken = jwtDecode(token);

      const userId = decodedToken.id;
      const captainId = data.id;

      try {
        const hasRatedResponse = await axios.get(
          `https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/hasRatedCaptain/${userId}/${captainId}`,
        );
        setHasRated(hasRatedResponse.data.hasRated);

        const averageRatingResponse = await axios.get(
          `https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/captainRating/${captainId}`,
        );
        setCaptainAverageRating(averageRatingResponse.data.averageRating);
      } catch (error) {
        console.error('Error checking if user has rated captain:', error);
      } finally {
        setModalVisible(true);
        setIsOpeningModal(false);
      }
    }
  };

  const rateCaptain = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(token);

    const userId = decodedToken.id;
    const captainId = data.id;

    try {
      await axios.post(
        `https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/ratePassenger`,
        {
          rating: userRating,
          passengerId: data.id,
          captainId: userId,
        },
      );
      getAverageRating(data.id);
      setModalVisible(false);
      alert('شكراً لتقيمك!');
    } catch (error) {
      console.error('Error rating captain:', error);
    }
  };
  const handleRatingChange = useCallback(rating => {
    setUserRating(rating);
  }, []);

  const RatingModal = ({visible, onRequestClose, onRate}) => {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            {hasRated ? (
              <View>
                <Text
                  style={{textAlign: 'center', fontSize: 18, marginBottom: 10}}
                  className="text-black font-bold">
                  لقد قمت بتقيم الراكب هذا الشهر بالفعل
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    backgroundColor: '#4b63ac',
                    borderRadius: 10,
                    alignItems: 'center',
                  }}
                  className="h-10">
                  <LinearGradient
                    // Button Linear Gradient
                    colors={['#4b63ac', '#a05193', '#e51978']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    locations={[0, 0.5, 1]}
                    angle={45}
                    className="rounded-lg"
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      اغلاق
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text
                  style={{textAlign: 'center', marginBottom: 10}}
                  className="text-black text-xl font-bold">
                  تقييم الكابتن
                </Text>
                <CustomRating rating={userRating} onRate={handleRatingChange} />

                <TouchableOpacity
                  onPress={rateCaptain}
                  style={{
                    backgroundColor: '#4b63ac',
                    borderRadius: 10,
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                  className="h-10">
                  <LinearGradient
                    // Button Linear Gradient
                    colors={['#4b63ac', '#a05193', '#e51978']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    locations={[0, 0.5, 1]}
                    angle={45}
                    className="rounded-lg"
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{color: 'white', fontWeight: 'bold'}}
                      className="text-xl">
                      اتمام
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const StatusModal = ({visible, onRequestClose, message}) => {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 20,
              // other styles
            }}>
            <Text className="text-4xl mx-auto text-center text-black">
              {message}
            </Text>
            <TouchableOpacity
              onPress={onRequestClose}
              style={{
                backgroundColor: '#4b63ac',
                borderRadius: 10,
                alignItems: 'center',
              }}
              className="h-12 rounded-full mt-5">
              <LinearGradient
                // Button Linear Gradient
                colors={['#4b63ac', '#a05193', '#e51978']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[0, 0.5, 1]}
                angle={45}
                className="rounded-full"
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: 'white', fontWeight: 'bold'}}
                  className="text-xl">
                  اغلاق
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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

      <View className="my-auto">
        {/* Render the data here */}
        <View className="mx-auto h-28 w-28 rounded-full overflow-hidden">
          <ImageBackground
            source={{uri: data.picture || null}}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 25,
            }}
            className="bg-[#a05193]"
            onLoadStart={handleImageLoadStart}
            onLoadEnd={handleImageLoadEnd}>
            {imageLoading && <ActivityIndicator size="small" color="#FFFFFF" />}
            {!imageLoading && !data.picture && (
              <Text className="text-white text-lg">{data.name.charAt(0)}</Text>
            )}
          </ImageBackground>
        </View>
        <Text className="mx-auto mt-3 text-2xl text-black">{data.name}</Text>
        <View className="mt-5 mx-auto">
          <Rating
            defaultRating={captainAverageRating}
            readonly={true}
            minValue={1}
            startingValue={captainAverageRating}
            imageSize={30}
          />
        </View>
        <Text className="mx-auto mt-3 text-2xl text-black">
          الاشتراك الشهري: {Intl.NumberFormat('EN').format(data.cost)} IQD
        </Text>
        <Text
          className={`mx-auto mt-3 text-2xl p-2 rounded-xl ${
            data.status === 'not_paid'
              ? 'bg-red-500 text-white'
              : data.status === 'accepted'
              ? 'bg-green-500 text-black'
              : data.status === 'waiting'
              ? 'bg-yellow-500 text-black'
              : ''
          }`}>
          {data.status === 'not_paid'
            ? 'غير مدفوع'
            : data.status === 'accepted'
            ? 'مدفوع'
            : data.status === 'waiting'
            ? 'بأنتظار موافقتك'
            : ''}
        </Text>
        <View className="flex-row mx-auto space-x-5">
          <TouchableOpacity
            onPress={handleCallButtonPress}
            className="h-14 w-14 rounded-full mt-10">
            <LinearGradient
              // Button Linear Gradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="rounded-full"
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {modalVisible ? (
                <ActivityIndicator size={'small'} color="#eb0a73" />
              ) : (
                <Ionicons name="call" size={30} color={'#fff'} />
              )}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePaymentButtonClick}
            className="h-14 w-14 rounded-full mt-10">
            <LinearGradient
              // Button Linear Gradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="rounded-full"
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {isPaymentModalVisible ? (
                <ActivityIndicator size={'small'} color="#eb0a73" />
              ) : (
                <Text
                  style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}
                  className="text-center">
                  معالجة الدفع
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <PaymentModal
            visible={isPaymentModalVisible}
            onRequestClose={() => setPaymentModalVisible(false)}
            onAccept={async () => {
              await handleAcceptPayment();
              setPaymentModalVisible(false);
            }}
          />

          <TouchableOpacity
            onPress={openRatingModal}
            className="h-14 w-14 rounded-full mt-10">
            <LinearGradient
              // Button Linear Gradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="rounded-full"
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {modalVisible ? (
                <ActivityIndicator size={'small'} color="#eb0a73" />
              ) : (
                <Text
                  style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
                  تقييم
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <RatingModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        onRate={handleRatingChange}
      />
      <StatusModal
        visible={isPaymentModalVisible2}
        onRequestClose={() => setPaymentModalVisible2(false)}
        message={paymentModalMessage}
      />
    </SafeAreaView>
  );
};

export default React.memo(ClientDataScreen);
