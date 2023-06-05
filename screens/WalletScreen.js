import {View, Text, Pressable, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

const API_URL = 'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev';

const WalletScreen = () => {
  const navigation = useNavigation();
  const [walletBalance, setWalletBalance] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeOrderCost, setActiveOrderCost] = useState(null);
  const [message, setMessage] = useState(null);
  const [walletPaymentModalVisible, setWalletPaymentModalVisible] =
    useState(false);
  const [isWalletPaymentError, setWalletPaymentError] = useState(false);
  const [walletPaymentErrorMessage, setWalletPaymentErrorMessage] =
    useState(null);

  async function fetchWalletBalance() {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`${API_URL}/users/wallet-balance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token, // Replace with your access token or a function that retrieves it
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching wallet balance');
      }

      const data = await response.json();
      setWalletBalance(data.walletBalance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  }

  useEffect(() => {
    async function fetchWalletBalance() {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/users/wallet-balance`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, // Replace with your access token or a function that retrieves it
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching wallet balance');
        }

        const data = await response.json();
        setWalletBalance(data.walletBalance);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    }
    // async function fetchActiveOrderCost() {
    //   try {
    //     const token = await AsyncStorage.getItem('jwtToken');
    //     const response = await fetch(`${API_URL}/activeOrderCost`, {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: token,
    //       },
    //     });

    //     if (!response.ok) {
    //       throw new Error('Error fetching active order cost');
    //     }

    //     const data = await response.json();
    //     setActiveOrderCost(data.costs);
    //   } catch (error) {
    //     console.error('Error fetching active order cost:', error);
    //   }
    // }

    // fetchActiveOrderCost();

    fetchWalletBalance();
  }, []);

  const formatBalance = balance => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };
  const getCustomMessage = apiMessage => {
    console.log(apiMessage);
    switch (apiMessage) {
      case 'Order payment set to waiting.':
        return 'تم الدفع وطلبك قيد المراجعة';
      case 'Your payment is under review.':
        return 'لقد قمت مسبقا بالدفع وطلبك قيد المراجعة';
      case 'You have already paid.':
        return 'لقد قمت بالدفع مسبقاً';
      case 'Insufficient wallet balance.':
        return 'رصيدك غير كافي';
      case 'Payment accepted and deducted from wallet.':
        return 'تم قبول عملية الدفع وتم خصم الرصيد من المحفظة';
      case 'Payment has already been accepted for this order.':
        return 'لقد قمت بالدفع مسبقاً';
      case 'No active orders found.':
        return 'ليس لديك اشتراك فعال حالياً';
      default:
        return apiMessage;
    }
  };

  const handlePayment = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`${API_URL}/payOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      const data = await response.json();
      const customMessage = getCustomMessage(data.message);
      setMessage(customMessage);
      fetchWalletBalance();
      if (data.message === 'Order payment set to waiting.') {
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleWalletPayment = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`${API_URL}/payAndAcceptOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      const data = await response.json();
      const customMessage = getCustomMessage(data.message);
      setWalletPaymentErrorMessage(customMessage);
      setWalletPaymentError(true);
      fetchWalletBalance();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <SafeAreaView>
      <Modal isVisible={!!message}>
        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
          <Text style={{fontSize: 20, textAlign: 'center'}}>{message}</Text>

          <TouchableOpacity
            className="mt-5 w-[95%] h-10 mx-auto"
            onPress={() => {
              setMessage(null);
              setModalVisible(false);
            }}>
            <LinearGradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="h-10 rounded-xl">
              <Text className="text-center my-auto text-2xl font-bold text-white">
                اغلاق
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
        <Text className="text-xl font-bold -ml-1 mt-0.5 text-[#a05193]">رجوع</Text>
      </Pressable>
      <Text className="mx-auto text-black font-bold text-2xl">
        الرصيد الحالي
      </Text>

      {walletBalance !== null && (
        <View className="flex items-center justify-center mt-5">
          <LinearGradient
            colors={['#4b63ac', '#a05193', '#e51978']}
            className="w-44 h-44 rounded-full items-center justify-center">
            <View className="w-40 h-40 bg-white rounded-full flex items-center justify-center">
              <Text className="font-bold text-2xl">
                {formatBalance(walletBalance)}
              </Text>
            </View>
          </LinearGradient>
        </View>
      )}

      <View className="space-y-5 mt-5">
        <TouchableOpacity
          className="mt-2 w-[75%] h-10 mx-auto"
          onPress={() => navigation.navigate('RegularOrder')}>
          <LinearGradient
            colors={['#4b63ac', '#a05193', '#e51978']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.5, 1]}
            angle={45}
            className="h-12 rounded-full">
            <Text className="text-center my-auto text-xl font-bold text-white">
              تعبئة المحفظة عن طريق زين كاش
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {/* <View className="relative w-[80%] h-1 mx-auto mt-7">
        <View className="border-b border-transparent rounded-full overflow-hidden">
          <LinearGradient
            colors={['#4b63ac', '#a05193', '#e51978']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.5, 1]}
            angle={45}
            className="h-full w-full"
          />
        </View>
      </View>
      <Text className="text-center my-auto text-2xl mt-5 font-bold text-black">
        دفع الاشتراك
      </Text>
      <View className="flex-row mx-auto space-x-5 mt-5">
        <TouchableOpacity
          className="w-[30%] h-10 mx-auto"
          onPress={() => setModalVisible(true)}>
          <LinearGradient
            colors={['#4b63ac', '#a05193', '#e51978']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.5, 1]}
            angle={45}
            className="h-12 rounded-full">
            <Text className="text-center my-auto text-xl font-bold text-white">
              نقدي
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[30%] h-10 mx-auto"
          onPress={() => setWalletPaymentModalVisible(true)}>
          <LinearGradient
            colors={['#4b63ac', '#a05193', '#e51978']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.5, 1]}
            angle={45}
            className="h-12 rounded-full">
            <Text className="text-center my-auto text-xl font-bold text-white">
              من المحفظة
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View> */}
      <Modal isVisible={walletPaymentModalVisible}>
        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
          <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 10}}>
            معلومات الاشتراك
          </Text>
          {activeOrderCost &&
            activeOrderCost.map((orderCost, index) => (
              <Text key={index} className="text-black mx-auto text-xl mt-5">
                سعر الاشتراك: {formatBalance(orderCost.cost)}
              </Text>
            ))}
          <TouchableOpacity
            className="mt-7 w-[95%] h-10 mx-auto"
            onPress={handleWalletPayment}>
            <LinearGradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="h-10 rounded-xl">
              <Text className="text-center my-auto text-xl font-bold text-white">
                تأكيد الدفع
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-3 w-[95%] h-10 mx-auto"
            onPress={() => {
              setWalletPaymentModalVisible(false);
            }}>
            <LinearGradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="h-10 rounded-xl">
              <Text className="text-center my-auto text-2xl font-bold text-white">
                اغلاق
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isWalletPaymentError}>
        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
          <Text style={{fontSize: 20, textAlign: 'center'}}>
            {walletPaymentErrorMessage}
          </Text>

          <TouchableOpacity
            className="mt-5 w-[95%] h-10 mx-auto"
            onPress={() => {
              setWalletPaymentModalVisible(false), setWalletPaymentError(null);
            }}>
            <LinearGradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="h-10 rounded-xl">
              <Text className="text-center my-auto text-2xl font-bold text-white">
                اغلاق
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={modalVisible}>
        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
          <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 10}}>
            معلومات الاشتراك
          </Text>
          {activeOrderCost &&
            activeOrderCost.map((orderCost, index) => (
              <Text key={index} className="text-black mx-auto text-xl mt-5">
                سعر الاشتراك: {formatBalance(orderCost.cost)}
              </Text>
            ))}
          <TouchableOpacity
            className="mt-10 w-[95%] h-10 mx-auto"
            onPress={handlePayment}>
            <LinearGradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="h-10 rounded-xl">
              <Text className="text-center my-auto text-xl font-bold text-white">
                تأكيد الدفع
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-2 w-[95%] h-10 mx-auto"
            onPress={() => setModalVisible(false)}>
            <LinearGradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="h-10 rounded-xl">
              <Text className="text-center my-auto text-xl font-bold text-white">
                رجوع
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default React.memo(WalletScreen);
