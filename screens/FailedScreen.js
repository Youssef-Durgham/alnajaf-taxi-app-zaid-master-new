import React, {useCallback} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

// Import your animation JSON file
import taxiAnimation from '../assets/fail.json';

const FailedScreen = () => {
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
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}} className="text-black">
          فشل في الحجز
        </Text>
        <Text style={{fontSize: 18, marginBottom: 20, textAlign: 'center'}} className="pl-10 pr-10 text-black">
          لقد قمت مسبقاً بالحجز لذلك لا يمكنك الحجز اكثر من مرة
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
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

export default React.memo(FailedScreen);
