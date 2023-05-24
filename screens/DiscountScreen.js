import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const DiscountScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      // Retrieve the JWT token from AsyncStorage
      const token = await AsyncStorage.getItem('jwtToken');

      if (!token) {
        console.error('JWT token not found');
        return;
      }

      // Fetch the messages from the API endpoint
      const response = await fetch(
        'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/messages',
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      if (!response.ok) {
        console.error('Error fetching messages:', response.status);
        return;
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false); // <-- set loading state after fetching data
    }
  };

  const markMessagesAsRead = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    try {
      if (!token) {
        console.error('JWT token not found');
        return;
      }

      await axios.get(
        'https://oi3ycq27x5.execute-api.me-south-1.amazonaws.com/dev/messages/read',
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error, token);
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    markMessagesAsRead();
  }, []);

  const navigation = useNavigation();
  return (
    <SafeAreaView className=" flex-1">
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
      <View className="p-5 mb-10">
        {isLoading ? (
          <ActivityIndicator className="" size="large" color="#000" /> // <-- Loading spinner
        ) : messages.length > 0 ? ( // <-- check if there are messages
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View className="" style={styles.messageContainer}>
                <Text className="text-lg text-black">{item.text}</Text>
                <Text className="text-sm mt-2">
                  {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text className="mx-auto my-auto text-3xl text-black font-bold">لا يوجد هدايا الآن</Text> // <-- display message if no messages
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
  },
  messageDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});

export default DiscountScreen;
