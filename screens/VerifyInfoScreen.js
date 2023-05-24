import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';

const createTaxiOrder = async (data, type) => {
  console.log(data);
  const token = await AsyncStorage.getItem('jwtToken');
  if (type === 'one') {
    try {
      const response = await fetch(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/taxiorder-vip-one',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Error creating taxi order:', error);
        return error.error;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error creating taxi order:', error);
      throw new Error(error.message);
    }
  } else if (type === 'many') {
    try {
      const response = await fetch(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/taxiorder-vip-many',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Error creating taxi order:', error);
        return error.error;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error creating taxi order:', error);
      throw new Error(error.message);
    }
  } else {
    try {
      const response = await fetch(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/taxiorder-normal',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Error creating taxi order:', error);
        return error.error;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error creating taxi order:', error);
      throw new Error(error.message);
    }
  }
};

const VerifyInfoScreen = ({route}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    ToLocation,
    fromlocation,
    phoneNumber,
    taxiType,
    typeOfWork,
    daysOfWork,
    tolat,
    tolong,
    genderType,
    screentype,
    groupPhoneNumbers,
  } = route.params;
  const navigation = useNavigation();
  const calculatePrice = async (
    fromlat,
    fromlong,
    tolat,
    tolong,
    taxiType,
    groupPhoneNumbers,
    daysOfWork,
  ) => {
    console.log(genderType);
    if (taxiType === 'many' && groupPhoneNumbers) {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await fetch(
          'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/calculateprice-many',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
            body: JSON.stringify({
              startLatitude: fromlat,
              startLongitude: fromlong,
              endLatitude: tolat,
              endLongitude: tolong,
              additionalPhones: groupPhoneNumbers,
              weeksdays: daysOfWork,
            }),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          console.error('Error calculating price:', error);
          setLoading(false);
          return null;
        }

        const data = await response.json();
        setLoading(false);
        return data;
      } catch (error) {
        console.error('Error calculating price:', error);
        setLoading(false);
        return null;
      }
    } else if (taxiType === 'one') {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await fetch(
          'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/calculateprice-one',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
            body: JSON.stringify({
              startLatitude: fromlat,
              startLongitude: fromlong,
              endLatitude: tolat,
              endLongitude: tolong,
              weeksdays: daysOfWork,
            }),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          console.error('Error calculating price:', error);
          setLoading(false);
          return null;
        }

        const data = await response.json();
        setLoading(false);
        return data.price;
      } catch (error) {
        console.error('Error calculating price:', error);
        return null;
      }
    } else {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await fetch(
          'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/calculateprice',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
            body: JSON.stringify({
              startLatitude: fromlat,
              startLongitude: fromlong,
              endLatitude: tolat,
              endLongitude: tolong,
              weeksdays: daysOfWork,
            }),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          console.error('Error calculating price:', error);
          setLoading(false);
          return null;
        }

        const data = await response.json();
        setLoading(false);
        return data.price;
      } catch (error) {
        console.error('Error calculating price:', error);
        return null;
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      const destinationLatitude = ToLocation.latitude;
      const destinationLongitude = ToLocation.longitude;
      let data = {};
      if (screentype === 'vip' && taxiType === 'many') {
        data = {
          taxiType,
          typeOfWork,
          daysOfWork,
          invitePhone: phoneNumber,
          destinationLatitude,
          destinationLongitude,
          additionalPhones: groupPhoneNumbers,
        };
      } else if (screentype === 'vip' && taxiType === 'one') {
        data = {
          taxiType,
          typeOfWork,
          daysOfWork,
          invitePhone: phoneNumber,
          destinationLatitude,
          destinationLongitude,
        };
      } else {
        data = {
          taxiType,
          typeOfWork,
          daysOfWork,
          invitePhone: phoneNumber,
          destinationLatitude,
          destinationLongitude,
          genderType,
        };
      }
      const result = await createTaxiOrder(data, taxiType);
      if (result === 'You already have a taxi order that has not expired') {
        navigation.navigate('Failed');
      } else {
        navigation.navigate('SuccessScreen');
      }
    } catch (error) {
      setIsProcessing(false);
      navigation.navigate('ApiError', {errorMessage: error.message});
    } finally {
      setIsProcessing(false);
    }
  };

  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const calculatedPrice = await calculatePrice(
        fromlocation?.coordinates[1],
        fromlocation?.coordinates[0],
        ToLocation.latitude,
        ToLocation.longitude,
        taxiType,
        groupPhoneNumbers,
        daysOfWork,
      );
      setPrice(calculatedPrice);
    };
    fetchData();
  }, [
    ToLocation.latitude,
    ToLocation.location,
    ToLocation.longitude,
    daysOfWork,
    fromlocation?.coordinates,
    groupPhoneNumbers,
    taxiType,
    tolat,
    tolong,
  ]);

  const convertDaysToArabic = days => {
    const daysInArabic = {
      Sunday: 'الأحد',
      Monday: 'الإثنين',
      Tuesday: 'الثلاثاء',
      Wednesday: 'الأربعاء',
      Thursday: 'الخميس',
      Friday: 'الجمعة',
      Saturday: 'السبت',
    };

    return days.map(day => daysInArabic[day]);
  };
  console.log(price);
  return (
    <SafeAreaView style={{flex: 1}}>
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
      <View style={{padding: 20, flex: 1}}>
        <View className="bg-white rounded-2xl mt-5">
          <LinearGradient
            // Button Linear Gradient
            colors={['#e51978', '#a05193', '#4b63ac']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.4, 1]}
            angle={45}
            className="flex h-14 w-full rounded-t-2xl justify-center items-center">
            <View className="">
              <Text className="text-white w-full text-center text-3xl my-auto">
                تأكيد المعلومات
              </Text>
            </View>
          </LinearGradient>
          <View className="p-5">
            {taxiType && screentype === 'vip' && (
              <Text className="text-black text-xl font-bold">
                نوع الحجز:{' '}
                {taxiType === 'one'
                  ? 'حجز لشخص واحد'
                  : taxiType === 'many' && 'حجز لمجموعة'}
              </Text>
            )}

            {taxiType && screentype !== 'vip' && (
              <Text className="text-black text-xl font-bold mt-1">
                نوع السيارة:{' '}
                {taxiType === 'salon' ? 'صالون' : taxiType === 'bus' && 'باص'}
              </Text>
            )}

            {genderType && (
              <Text className="text-black text-xl font-bold mt-1">
                فئة الخط:{' '}
                {genderType === 'girl'
                  ? 'اناث فقط'
                  : genderType === 'mixed' && 'مختلط'}
              </Text>
            )}
            {typeOfWork && (
              <Text className="text-black text-xl font-bold mt-1">
                وقت الدوام:{' '}
                {typeOfWork === 'morning'
                  ? 'صباحي'
                  : typeOfWork === 'evening' && 'مسائي'}
              </Text>
            )}

            <Text className="text-black text-xl font-bold mt-1">
              ايام الدوام:{' '}
              {daysOfWork
                ? convertDaysToArabic(daysOfWork).join(', ')
                : 'Not provided'}
            </Text>

            {phoneNumber && (
              <Text className="text-black text-xl font-bold mt-1">
                رقم الشخص الذي دعاك: {phoneNumber}
              </Text>
            )}

            <View>
              {loading && <ActivityIndicator size="large" color="#eb0a73" />}
              {!loading &&
                price &&
                groupPhoneNumbers &&
                taxiType === 'many' &&
                price.costs.map((item, index) => (
                  <View key={index}>
                    <Text className="text-black text-xl font-bold mt-1">
                      رقم المشترك{' '}
                      {index + 1 === 1
                        ? 'الأول'
                        : index + 1 === 2
                        ? 'الثاني'
                        : index + 1 === 3
                        ? 'الثالث'
                        : index + 1 === 4
                        ? 'الرابع'
                        : ''}
                      : {item.phoneNumber}
                    </Text>

                    <Text className="text-black text-xl font-bold mt-1">
                      السعر المبدئي للاشتراك:{' '}
                      {item.cost.toLocaleString('en-US')} IQD
                    </Text>
                  </View>
                ))}
            </View>
          </View>
          <View className="flex mx-auto mb-3">
            {price && taxiType !== 'many' && (
              <Text className="text-black text-xl font-bold mt-1">
                السعر المبدئي للاشتراك: {price.toLocaleString('en-US')} IQD
              </Text>
            )}
          </View>
        </View>

        <View className="justify-center items-center mt-10">
          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={isProcessing}
            className="w-[50%] h-14 rounded-full mx-auto">
            <LinearGradient
              // Button Linear Gradient
              colors={['#e51978', '#a05193', '#4b63ac']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.4, 1]}
              angle={45}
              className="w-full justify-center items-center mx-auto p-3 h-14 rounded-full">
              {isProcessing ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-center my-auto text-white text-xl font-bold">
                  تثبيت
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom Buttons */}
        <View>
          {/* الغاء Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Cancel')}
            className="w-[50%] h-14 rounded-full mx-auto mt-5">
            <LinearGradient
              // Button Linear Gradient
              colors={['#e51978', '#a05193', '#4b63ac']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.4, 1]}
              angle={45}
              className="w-full justify-center items-center rounded-full mx-auto p-3 h-14">
              <Text className="text-center my-auto text-white text-xl font-bold">
                الغاء
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(VerifyInfoScreen);
