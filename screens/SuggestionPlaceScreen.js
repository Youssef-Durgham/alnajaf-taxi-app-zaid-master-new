import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  Keyboard,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const SuggestionPlaceScreen = ({route}) => {
  const {
    fromlat,
    fromlong,
    taxiType,
    typeOfWork,
    daysOfWork,
    genderType,
    phoneNumber,
  } = route.params;
  const [search, setSearch] = useState('');
  const [suggestionPlaces, setSuggestionPlaces] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (search.length > 0) {
      getSuggestions(search);
    } else {
      setSuggestionPlaces([]);
    }
  }, [search]);

  const getSuggestions = async search => {
    try {
      const response = await fetch(
        `https://zyvlz2xt17.execute-api.us-east-1.amazonaws.com/dev/suggestion-places?search=${search}`,
      );
      const data = await response.json();
      setSuggestionPlaces(data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectLocation = location => {
    Keyboard.dismiss();
    setSearch('');
    setSuggestionPlaces([]);
    navigation.navigate('VerifyInfo', {
      tolocation: location,
      fromlat,
      fromlong,
      taxiType,
      typeOfWork,
      daysOfWork,
      genderType,
      phoneNumber,
    });
  };

  const name = 'اضف موقع الرحلة';
  const checkmanual = true;
  const handleNavigateToMap = () => {
    navigation.navigate('ManualLocationInput', {
      name,
      checkmanual,
      fromlat,
      fromlong,
      taxiType,
      typeOfWork,
      daysOfWork,
      genderType,
      phoneNumber,
    });
  };
  return (
    <SafeAreaView className="bg-white flex-1 h-screen">
      
    </SafeAreaView>
  );
};

export default React.memo(SuggestionPlaceScreen);
