import {View, Text, ScrollView, Pressable} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-white">
      <View className="flex flex-row mt-5">
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
      </View>
      <View className="px-4 pt-5 pb-2 flex-1">
        <Text className="text-3xl font-bold text-black text-center mb-8">
          الشروط والأحكام
        </Text>
        <ScrollView style={{height: '100%'}}>
          <View className="px-6 py-4 border-b border-gray-300">
            <Text className="text-lg text-black mb-2 font-bold">
              1. الأهلية والموافقة
            </Text>
            <Text className="text-base text-gray-600">
              يجب على جميع مستخدمي التطبيق الموافقة على الشروط والأحكام التالية
              للاستخدام الصحيح للتطبيق والموارد الأخرى المتاحة عبر التطبيق.
            </Text>
          </View>
          <View className="px-6 py-4 border-b border-gray-300">
            <Text className="text-lg text-black mb-2 font-bold">
              2. المحتوى والملكية الفكرية
            </Text>
            <Text className="text-base text-gray-600">
              يتمتع التطبيق بجميع حقوق الملكية الفكرية المنصوص عليها في القوانين
              الوطنية والدولية ذات الصلة.
            </Text>
          </View>
          <View className="px-6 py-4 border-b border-gray-300">
            <Text className="text-lg text-black mb-2 font-bold">
              3. المسؤولية
            </Text>
            <Text className="text-base text-gray-600">
              يتحمل المستخدمون المسؤولية الكاملة عن استخدام التطبيق وجميع
              البيانات والمعلومات والمحتوى المنشورة عليه.
            </Text>
          </View>
          <View className="px-6 py-4 border-b border-gray-300">
            <Text className="text-lg text-black mb-2 font-bold">
              4. التغييرات على الشروط والأحكام
            </Text>
            <Text className="text-base text-gray-600">
              يحتفظ مالكو التطبيق بحق تغيير الشروط والأحكام في أي وقت دون إشعار
              مسبق. ويجب على جميع المستخدمين الاطلاع على هذه الشروط والأحكام
              بشكل منتظم.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default React.memo(TermsAndConditionsScreen);
