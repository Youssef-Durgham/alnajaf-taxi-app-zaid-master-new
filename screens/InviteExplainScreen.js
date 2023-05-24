import {View, Text, Pressable, Image} from 'react-native';
import React from 'react';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native';

const InviteExplainScreen = () => {
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

      <View className="flex-1 items-center justify-center">
        <Text className="text-center text-xl font-bold mb-6 text-black">
          ١. عند حجز الشخص المدعو عن طريقك يجب عليه إضافة رقم هاتفك في الحقل
        </Text>

        <Image
          source={require('../assets/invite.png')}
          className="w-[90%] h-32 mb-6"
          resizeMode="contain"
        />

        <Text className="text-center text-xl font-bold mb-6 text-black">
          ٢. عند تثبيت الحجز سوف تحصل على (٥٠) نقاط في حسابك الشخصي
        </Text>

        <Text className="text-center text-xl font-bold mb-6 text-black">
          ٣. كلما زادت عدد النقاط زادت الجوائز والخصومات حتى تصل إلى ١٠٠٪
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default InviteExplainScreen;
