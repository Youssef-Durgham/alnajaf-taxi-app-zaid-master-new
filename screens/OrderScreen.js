import {View, Text, Pressable, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const OrderScreen = () => {
  const navigation = useNavigation();
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
      <Text className="text-black font-bold text-2xl ml-auto mx-auto">
        احجز خطك الان !
      </Text>
      <Text className="text-gray-400 font-bold text-xl ml-auto mx-auto">
        اختر نوع الخط
      </Text>
      <View className=" space-y-8 flex-1 mt-5">
        <View className="w-[90%] bg-white mx-auto flex-[0.4] mt-2 rounded-2xl items-center">
          <View className="w-[50%] h-[30%] flex justify-center items-center">
            <Image
              source={require('../assets/taxi4.png')}
              className="object-cover h-full w-full"
              style={{transform: [{scaleX: -1}], margin: 10}}
            />
          </View>
          <Text className="mt-2 text-gray-400 font-semibold text-xl">
            احجز مع خطي
          </Text>
          <TouchableOpacity
            className="mt-2 w-[50%] h-12 "
            onPress={() => navigation.navigate('RegularOrder')}>
            <LinearGradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="h-12 rounded-full">
              <Text className="text-center my-auto text-2xl font-bold text-white">
                خط عادي
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View className="relative -top-3 w-[80%] h-1 mx-auto">
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

        <View className="w-[90%] bg-white mx-auto flex-[0.4] mt-2 rounded-2xl items-center">
          <View className="w-[50%] h-[30%] flex justify-center items-center">
            <Image
              source={require('../assets/taxi3.png')}
              className="object-cover h-full w-full"
            />
          </View>

          <Text className="mt-2 text-gray-400 font-semibold text-xl text-center pl-16 pr-16">
            احجز خط خاص بك فقط او مع مجموعة من اختيارك
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('VipOrder')}
            className="mt-2 w-[50%] h-12">
            <LinearGradient
              colors={['#4b63ac', '#a05193', '#e51978']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.5, 1]}
              angle={45}
              className="h-12 rounded-full">
              <Text className="text-center my-auto text-2xl font-bold text-white">
                خط خاص <Text>(vip)</Text>
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(OrderScreen);
