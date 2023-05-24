import React, {useEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native';
import {ChevronLeftIcon, PencilIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const customTitles = {
  paymentStatus: 'حالة الدفع',
  taxiType: 'نوع السيارة',
  typeOfWork: 'وقت الدوام',
  // daysOfWork: 'أيام الدوام',
  status: 'حالة الطلب',
  ordertype: 'نوع الخط',
  cost: 'التكلفة',
  daysLeft: 'الأيام المتبقية',
};

const translations = {
  paymentStatus: {
    not_paid: 'غير مدفوع',
    waiting: 'في الانتظار',
    accepted: 'مدفوع',
  },
  typeOfWork: {
    morning: 'صباحي',
    evening: 'مسائي',
  },
  status: {
    created: 'أُنشئ',
    accepted: 'مقبول',
  },
  ordertype: {
    normal: 'عادي',
    vip: 'مميز',
  },
  taxitype: {
    salon: 'صالون',
    bus: 'باص',
  },
};

const OrderDataScreen = props => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(
        'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/orderdata/last',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Error fetching order data', response);
      }

      const data = await response.json();

      if (data === false) {
        setOrderData(null);
      } else {
        const selectedData = {
          paymentStatus: translations.paymentStatus[data.paymentStatus],
          taxiType: translations.taxitype[data.taxiType],
          typeOfWork: translations.typeOfWork[data.typeOfWork],
          // daysOfWork: data.daysOfWork.join(', '),
          status: translations.status[data.status],
          ordertype: translations.ordertype[data.ordertype],
          cost: `${new Intl.NumberFormat('EN').format(data.cost)} IQD`,
          daysLeft: data.daysLeft,
        };
        setOrderData(selectedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-gray-100">
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
      <View className="p-5 h-screen">
        {loading ? (
          <SkeletonPlaceholder>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <View style={{width: 60, height: 60, borderRadius: 50}} />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{
                    marginTop: 6,
                    width: 80,
                    height: 20,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          </SkeletonPlaceholder>
        ) : orderData === null ? (
          <Text>لا يوجد طلبات</Text>
        ) : (
          <View className=" mt-10">
            {Object.entries(orderData).map(([key, value]) => (
              <View
                key={key}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                  padding: 15,
                  backgroundColor: '#ffffff',
                  borderRadius: 5,
                }}>
                <Text style={{fontSize: 18, color: '#000000'}} className="">
                  {value}
                </Text>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', color: '#000000'}}>
                  {customTitles[key] || key}:
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderDataScreen;
