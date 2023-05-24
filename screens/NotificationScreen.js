import {View, Text, Pressable, FlatList, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = await AsyncStorage.getItem('jwtToken');

      axios
        .get(
          'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/notifications',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          },
        )
        .then(response => {
          setNotifications(response.data);
          setLoading(false); // Set loading state to false when notifications are loaded
        })
        .catch(error => {
          console.error(error);
          setLoading(false); // Set loading state to false in case of error
        });
    };

    fetchNotifications();
  }, []);

  return (
    <SafeAreaView className="bg-white flex-1">
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
      {loading ? ( // Show loading spinner if loading state is true
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-black">{item.title}</Text>
              <Text className="text-sm mt-3">{item.body}</Text>
              <Text className="text-gray-500 text-xs">
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text className="mx-auto text-black text-xl">No notifications yet</Text>
      )}
    </SafeAreaView>
  );
};

export default React.memo(NotificationScreen);
