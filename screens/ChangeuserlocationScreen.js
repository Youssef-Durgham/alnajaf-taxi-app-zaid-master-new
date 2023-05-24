import {View, Text, SafeAreaView, Pressable} from 'react-native';
import React from 'react';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import Changeuserlocation from '../components/Changeuserlocation';

const ChangeuserlocationScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="bg-white flex-1">
      {/* <Pressable className="mt-5 ml-4 w-5" onPress={() => navigation.goBack()}>
        <ChevronLeftIcon
          size={35}
          className="font-semibold"
          strokeWidth={2.5}
          color={'#000'}
        />
      </Pressable> */}
      <Changeuserlocation />
    </SafeAreaView>
  );
};

export default ChangeuserlocationScreen;
