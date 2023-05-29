import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  Pressable,
  ImageBackground,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [imageLoading, setImageLoading] = useState(false); // Add image loading state
console.log(orders)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await fetch(
          'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/api/orders-subscribe/captain',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error('Error fetching order data');
        }
        const responseData = await response.json();
        setOrders(responseData);
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error('Error fetching order data:', error);
        // Handle the error appropriately, e.g., show an error message
      }
    };

    fetchOrders();
  }, []);

  const handleImageLoadStart = () => {
    setImageLoading(true);
  };

  const handleImageLoadEnd = () => {
    setImageLoading(false);
  };

  const handleItemPress = item => {
    navigation.navigate('ClientData', {data: item});
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        className="flex-row items-center bg-white w-[90%] mx-auto p-2 rounded-xl mt-3">
        <View className="ml-auto flex-row pr-3">
          <Text className="mr-5 text-xl text-black text-center my-auto">
            {item.name}
          </Text>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              overflow: 'hidden',
            }}>
            <ImageBackground
              source={{uri: item.picture || null}}
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
              {imageLoading && (
                <ActivityIndicator size="small" color="#FFFFFF" />
              )}
              {!imageLoading && !item.picture && (
                <Text className="text-white text-lg">
                  {item.name.charAt(0)}
                </Text>
              )}
            </ImageBackground>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1">
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

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#a05193" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          className="mt-10"
        />
      )}
    </SafeAreaView>
  );
};

export default React.memo(OrderScreen);
