import React, {useState} from 'react';
import {View, TextInput, Alert, Text, Pressable} from 'react-native';
import axios from 'axios';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import {t} from 'react-native-tailwindcss';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SupportScreen = () => {
  const [message, setMessage] = useState('');

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (message === '') {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.post(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/support',
        {
          message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );
      Alert.alert('Success', 'Support request submitted successfully');
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit support request');
    }
  };

  return (
    <View className="flex-1 bg-White p-6">
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
      <Text className="mt-5 text-black text-xl mx-auto font-bold">
        ابلغ عن المشكلة
      </Text>
      <TextInput
        className="border p-3 text-lg my-3 mt-10 w-full rounded-lg bg-gray100"
        multiline={true}
        numberOfLines={4}
        onChangeText={text => setMessage(text)}
        value={message}
        placeholder="اكتب رسالتك هنا ...."
      />
      <Pressable
        className="items-center py-3 mt-5 rounded bg-blue-500"
        onPress={handleSubmit}>
        <Text className="text-white text-lg">Submit</Text>
      </Pressable>
    </View>
  );
};

export default React.memo(SupportScreen);
