import React, {useEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';

const InternetCheck = ({children}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRetry = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected);
  };

  if (!isConnected) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <Text className="text-black text-2xl font-bold mb-5">
          لا يوجد انترنيت حالياً
        </Text>
        <Pressable
          onPress={handleRetry}
          className="w-[40%] mx-auto h-12 rounded-full mt-3">
          <LinearGradient
            // Button Linear Gradient
            colors={['#e51978', '#a05193', '#4b63ac']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.4, 1]}
            angle={45}
            className="w-full justify-center items-center rounded-full mx-auto h-12">
            <Text className="text-center my-auto text-white text-xl font-bold">
              اعد المحاولة
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return children;
};

export default InternetCheck;
