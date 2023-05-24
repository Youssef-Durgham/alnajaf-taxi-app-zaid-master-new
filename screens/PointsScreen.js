import {View, Text, Pressable, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

const API_URL = 'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev';

const PointsScreen = () => {
  const navigation = useNavigation();
  const [userPoints, setUserPoints] = useState(0);
  async function fetchUserPoints() {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`${API_URL}/user/points`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching user points');
      }

      const data = await response.json();
      setUserPoints(data.points);
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  }
  useEffect(() => {
    fetchUserPoints();
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
      <Text className="mx-auto text-black font-bold text-2xl">
        رصيد نقاطي الحالية
      </Text>

      {userPoints !== null && (
        <View className="flex items-center justify-center mt-5 my-auto">
          <LinearGradient
            colors={['#4b63ac', '#a05193', '#e51978']}
            className="w-44 h-44 rounded-full items-center justify-center">
            <View className="w-40 h-40 bg-white rounded-full flex items-center justify-center">
              <Text className="font-bold text-2xl">{userPoints}</Text>
            </View>
          </LinearGradient>
        </View>
      )}
    </SafeAreaView>
  );
};

export default React.memo(PointsScreen);
