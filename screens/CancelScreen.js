import {View, Text, Pressable, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const CancelScreen = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const radioButtonTitles = [
    'المسار غير صحيح',
    'السعر مرتفع',
    'لا يوجد سبب',
    'اخرى',
  ];

  useEffect(() => {
    if (selectedOption === 3) {
      setInputVisible(true);
    } else {
      setInputVisible(false);
    }
  }, [selectedOption]);

  const handleSelection = index => {
    setSelectedOption(index);
    printSelectedValue(index);
  };

  const handleInputChange = text => {
    setInputText(text);
    printSelectedValue(selectedOption, text);
  };

  const printSelectedValue = (index, inputTextValue = null) => {
    if (index !== 3) {
      console.log(radioButtonTitles[index]);
    } else if (inputTextValue) {
      console.log(inputTextValue);
    }
  };

  const submitSuggestion = async message => {
    const token = await AsyncStorage.getItem('jwtToken');
    try {
      const response = await fetch(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/suggestions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({text: message}),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Suggestion submitted:', data);
        return true; // Add this line to return true on successful submission
      } else {
        console.error('Error submitting suggestion:', response.status);
        return false; // Add this line to return false on failed submission
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error.message);
      return false; // Add this line to return false on error
    }
  };

  const handleSubmit = async () => {
    const message =
      selectedOption !== 3 ? radioButtonTitles[selectedOption] : inputText;
    if (message) {
      const success = await submitSuggestion(message);
      if (success) {
        navigation.navigate('Home');
      }
    } else {
      console.log('No option selected');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          padding: 12,
          marginTop: 12,
          marginRight: 12,
          borderRadius: 9999,
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={35} strokeWidth={2.5} color={'#000'} />
        </Pressable>
      </View>
      <View>
        <Text
          style={{
            textAlign: 'center',
            color: 'black',
            fontWeight: 'bold',
            fontSize: 24,
          }}>
          هل تواجة مشكلة؟!
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          marginTop: 12,
          alignItems: 'flex-end',
          marginRight: 20,
        }}
        className="mr-5 pt-10">
        {radioButtonTitles.map((title, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
            <Text className="text-black text-lg font-bold">{title}</Text>
            <Pressable
              onPress={() => handleSelection(index)}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#e5e5e5' : 'transparent',
                  borderRadius: 9999,
                  borderWidth: 2,
                  borderColor: '#eb0a73',
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 8,
                },
              ]}>
              {selectedOption === index && (
                <View
                  style={{
                    backgroundColor: '#eb0a73',
                    borderRadius: 9999,
                    width: 12,
                    height: 12,
                  }}
                />
              )}
            </Pressable>
          </View>
        ))}
      </View>
      {inputVisible && (
        <TextInput
          onChangeText={handleInputChange}
          value={inputText}
          placeholder="Enter text here..."
          className="border-b-0.5 border-[#eb0a73] p-2 text-lg text-center mx-auto w-[75%] text-black font-bold"
        />
      )}

      <Pressable
        onPress={handleSubmit}
        style={({pressed}) => [
          {
            backgroundColor: pressed ? '#C026D3' : '#9333EA',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 12,
          },
        ]}
        className="bg-black w-[75%] mx-auto h-12 rounded-full mt-10">
        <LinearGradient
          // Button Linear Gradient
          colors={['#e51978', '#a05193', '#4b63ac']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          locations={[0, 0.4, 1]}
          angle={45}
          className="w-full justify-center items-center rounded-full mx-auto h-12">
          <Text className="text-center my-auto font-bold text-white text-xl">
            اكمال
          </Text>
        </LinearGradient>
      </Pressable>
    </SafeAreaView>
  );
};

export default CancelScreen;
