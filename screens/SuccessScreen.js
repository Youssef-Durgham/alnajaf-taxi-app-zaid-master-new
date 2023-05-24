import React, {useCallback} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

// Import your animation JSON file
import taxiAnimation from '../assets/done.json';

const SuccessScreen = () => {
  const navigation = useNavigation();
  const animationRef = React.createRef();

  useFocusEffect(
    useCallback(() => {
      if (animationRef.current) {
        animationRef.current.play();
      }
    }, []),
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LottieView
          ref={animationRef}
          source={taxiAnimation}
          autoPlay
          loop={true}
          style={{width: 300, height: 300}}
        />
        <Text
          style={{fontSize: 24, fontWeight: 'bold', marginBottom: 30}}
          className="text-black text-center">
          شكراً لثقتك في خطي لقد تم تثبيت حجزك واشتراكك في خطي وسيتم اشعارك بعد
          معالجة طلبك
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="w-[50%] h-14 rounded-full mx-auto">
          <LinearGradient
            // Button Linear Gradient
            colors={['#e51978', '#a05193', '#4b63ac']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.4, 1]}
            angle={45}
            className="w-full justify-center items-center rounded-full mx-auto p-3 h-14">
            <Text className="text-center my-auto text-white text-xl font-bold">
              رجوع
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(SuccessScreen);
