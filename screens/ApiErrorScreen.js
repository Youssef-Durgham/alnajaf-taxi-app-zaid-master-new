import React from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

// Import your animation JSON file
import taxiAnimation from '../assets/fail.json';

const ApiErrorScreen = ({errorMessage}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LottieView
          source={taxiAnimation}
          autoPlay
          loop
          style={{width: 300, height: 300}}
        />
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 30}}>
          مشكلة في الخادم
        </Text>
        <Text style={{fontSize: 18, marginBottom: 20, textAlign: 'center'}}>
          {errorMessage}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: 'red',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 5,
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
            رجوع
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(ApiErrorScreen);
