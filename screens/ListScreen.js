import React from 'react';
import {Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ListScreen = React.memo(() => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex h-full">
      <TouchableOpacity className=" h-12 flex pr-5 justify-center w-[90%] rounded-t-xl mx-auto border-b border-neutral-200 bg-white mt-10">
        <Text
          onPress={() => {
            navigation.navigate('Support');
          }}
          className="text-black text-lg font-medium">
          مركز المساعدة
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className=" h-12 flex pr-5 justify-center w-[90%] mx-auto border-b border-neutral-200 bg-white">
        <Text className="text-black text-lg font-medium">اعمل ككابتن</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('TermsAndConditions');
        }}
        className=" h-12 flex pr-5 justify-center w-[90%] mx-auto rounded-b-xl border-neutral-200 bg-white">
        <Text className="text-black text-lg font-medium">
          شروط الخصوصية والاحكام
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
});

export default ListScreen;
