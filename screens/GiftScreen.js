import {View, Text, SafeAreaView, Pressable, FlatList} from 'react-native';
import React from 'react';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const GiftScreen = () => {
  const navigation = useNavigation();

  const navigateToAnotherScreen = () => {
    navigation.navigate('InviteExplain');
  };

  const renderItem = ({item}) => {
    // Render your flatlist item here
    return (
      <View>
        <Text>{item.title}</Text>
        {/* Add other content for each item */}
      </View>
    );
  };

  const fakeData = [
    {id: 1, title: 'Item 1'},
    {id: 2, title: 'Item 2'},
    {id: 3, title: 'Item 3'},
    // Add more items as needed
  ];

  return (
    <SafeAreaView className="p-5" style={{flex: 1}}>
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
      <View
        className="p-5 mt-4"
        style={{
          borderColor: '#a05193',
          borderWidth: 2,
          borderRadius: 15,
          margin: 10,
        }}>
        <View className="bg-white p-5 rounded-xl">
          <Text className="text-center text-2xl text-black font-bold">
            كن سفير خطي
          </Text>
          <Text className="text-center text-lg text-black mt-5">
            أربح نقاط كونك سفيراً لخطي عن طريق دعوة اصدقائك للتطبيق
          </Text>

          <Pressable
            onPress={navigateToAnotherScreen}
            style={{
              width: '50%',
              height: 48,
              borderRadius: 10,
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#c5c5c5',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: 'black',
                textAlign: 'center',
              }}>
              تفاصيل اكثر ...
            </Text>
          </Pressable>
        </View>

        <View className="bg-white mt-5 p-5 rounded-xl">
          <Text className="text-center text-2xl mt-5 text-black font-bold">
            ادفع عن طريق زين كاش
          </Text>
          <Text className="text-center text-lg mt-5 text-black mb-4">
            عند دفع اشتراك خطك عن طريق زين كاش سوف تحصل على ٥٠ نقطة في حسابك
            الشخصي
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate('Discount')}
        className="w-[50%] mx-auto h-12 rounded-full mt-3">
        <LinearGradient
          // Button Linear Gradient
          colors={['#e51978', '#a05193', '#4b63ac']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          locations={[0, 0.4, 1]}
          angle={45}
          className="w-full justify-center items-center rounded-full mx-auto p-3 h-12">
          <Text
            style={{fontSize: 14, fontWeight: 'bold'}}
            className="text-center my-auto text-white">
            الجوائز الحالية
          </Text>
        </LinearGradient>
      </Pressable>
      {/* <Text className="text-center text-black text-2xl mt-5 font-bold">
        الجوائز الحالية
      </Text>

      <FlatList
        data={fakeData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        style={{marginTop: 10}}
      /> */}
    </SafeAreaView>
  );
};

export default GiftScreen;
