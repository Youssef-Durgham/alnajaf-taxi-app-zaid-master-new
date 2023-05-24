import React, {useEffect, useState} from 'react';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {Platform, PermissionsAndroid} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
const {width} = Dimensions.get('window');
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import {TextInput} from 'react-native';

const RegularOrderScreen = ({route}) => {
  const navigation = useNavigation();
  const [taxiType, setTaxiType] = useState('');
  const [genderType, setGenderType] = useState('');
  const [typeOfWork, setTypeOfWork] = useState('');
  const [daysOfWorks, setDaysOfWorks] = useState([]);
  const [FromLocation, setFromLocation] = useState(null);
  const [ToLocation, setToLocation] = useState(null);
  const [daysOfWork, setDaysOfWork] = useState([
    {label: 'الأحد', value: 'Sunday'},
    {label: 'الاثنين', value: 'Monday'},
    {label: 'الثلاثاء', value: 'Tuesday'},
    {label: 'الأربعاء', value: 'Wednesday'},
    {label: 'الخميس', value: 'Thursday'},
    {label: 'الجمعة', value: 'Friday'},
    {label: 'السبت', value: 'Saturday'},
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const daysArabic = [
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
    'الأحد',
  ];
  const daysEnglish = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const taxiTypesArabic = ['صالون', 'باص'];
  const genderTypesArabic = ['مختلط', 'اناث فقط'];
  const taxiTypesEnglish = ['salon', 'bus'];
  const genderTypesEnglish = ['mixed', 'girl'];
  const [phoneNumber, setPhoneNumber] = useState('');
  const workTypesArabic = ['صباحي', 'مسائي'];
  const workTypesEnglish = ['morning', 'evening'];
  const [location, setLocation] = useState(null);
  const [daysOpen, setDaysOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const fetchLocation = async () => {
    setLoading(true);
    let locationData;

    // Retry fetching data for a maximum of 3 attempts
    for (let attempt = 1; attempt <= 3; attempt++) {
      const token = await AsyncStorage.getItem('jwtToken');
      try {
        const response = await axios.get(
          'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/userlocation',
          {
            headers: {
              Authorization: token,
            },
          },
        );
        locationData = await response.data.location;

        // If location data is successfully fetched, break the loop
        if (locationData) {
          break;
        }
      } catch (error) {
        console.error(
          `Attempt ${attempt}: Failed to fetch location data`,
          error,
        );
      }
    }

    if (locationData) {
      setLocation(locationData);
    } else {
      // Handle the case when location data is still not fetched after all attempts
      console.error('Failed to fetch location data after all attempts');
      // You can set a default location or show an error message to the user
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // useEffect(() => {
  //   const fetchUserLocation = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('jwtToken');
  //       const response = await axios.get(
  //         'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/userlocation',
  //         {
  //           headers: {
  //             Authorization: token,
  //           },
  //         },
  //       );

  //       setLocation(response.data.location);
  //       setLoading(false);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchUserLocation();
  // }, []);

  const citiesData = taxiTypesArabic.map((item, index) => ({
    arabic: item,
    english: taxiTypesEnglish[index],
  }));

  const gender = genderTypesArabic.map((item, index) => ({
    arabic: item,
    english: genderTypesEnglish[index],
  }));

  const categoriesData = workTypesArabic.map((item, index) => ({
    arabic: item,
    english: workTypesEnglish[index],
  }));

  const toggleCity = (item, index) => {
    setTaxiType(item.english);
  };

  const tooglegender = (item, index) => {
    setGenderType(item.english);
  };

  const toggleCategory = (item, index) => {
    setTypeOfWork(item.english);
  };

  const handleLocationChoice = async choice => {
    if (choice === 'current') {
      if (Platform.OS === 'android') {
        const granted = await requestLocationPermission();
        if (!granted) {
          alert('Location permission is required to get the current location.');
          return;
        }
      }
      console.log(daysOfWorks);

      Geolocation.getCurrentPosition(
        position => {
          // Pass the location data to the next screen or save it

          navigation.navigate('SuggestionPlace', {
            fromlat: position.coords.latitude,
            fromlong: position.coords.longitude,
            taxiType,
            typeOfWork,
            daysOfWork: daysOfWorks,
            genderType,
            phoneNumber,
            fromlocation: location,
          });
        },
        error => console.log(error),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } else if (choice === 'manual') {
      navigation.navigate('MapNew', {
        taxiType,
        typeOfWork,
        daysOfWork: daysOfWorks,
        genderType,
        phoneNumber,
        fromlocation: location,
      });
    }
    setModalVisible(false);
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleClose = () => {
    setDaysOpen(false);
  };

  const handleContinue = () => {
    handleLocationChoice('manual');
  };

  useEffect(() => {
    if (route.params?.updatedData) {
      // Update the state with the data received from MapNew
      const {
        phoneNumber,
        genderType,
        typeOfWork,
        daysOfWork,
        fromlocation,
        taxiType,
        Tolocation,
      } = route.params.updatedData;
      setPhoneNumber(phoneNumber);
      setGenderType(genderType);
      setTaxiType(taxiType);
      setDaysOfWorks(daysOfWork);
      setFromLocation(fromlocation);
      setToLocation(Tolocation);
      setTypeOfWork(typeOfWork);
    }
  }, [route.params?.updatedData]);

  const isNextButtonDisabled = () => {
    return !(
      taxiType &&
      typeOfWork &&
      daysOfWorks.length > 0 &&
      genderType &&
      ToLocation
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
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
      <Text className="mx-auto text-black text-2xl font-bold">
        الحجز العادي
      </Text>

      {loading ? (
        <View className="my-auto">
          <ActivityIndicator size="large" color="#eb0a73" />
        </View>
      ) : (
        <View className="flex mt-5 space-y-2 flex-1 h-screen">
          <View className="w-[75%] mx-auto">
            <SelectDropdown
              data={citiesData}
              onSelect={(selectedItem, index) => {
                toggleCity(selectedItem, index);
              }}
              defaultButtonText={'نوع السيارة'}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.arabic;
              }}
              rowTextForSelection={(item, index) => {
                return item.arabic;
              }}
              buttonStyle={{
                ...styles.dropdown1BtnStyle,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0.5,
                borderBottomColor: '#eb0a73',
                borderRadius: 0,
              }}
              buttonTextStyle={{
                ...styles.dropdown1BtnTxtStyle,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000',
              }}
              renderDropdownIcon={isOpened => {
                return (
                  <FontAwesome
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#444'}
                    size={16}
                  />
                );
              }}
              dropdownIconPosition={'left'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
            />
          </View>
          <View className="w-[75%] mx-auto">
            <SelectDropdown
              data={gender}
              onSelect={(selectedItem, index) => {
                tooglegender(selectedItem, index);
              }}
              defaultButtonText={'فئة الخط'}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.arabic;
              }}
              rowTextForSelection={(item, index) => {
                return item.arabic;
              }}
              buttonStyle={{
                ...styles.dropdown1BtnStyle,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0.5,
                borderBottomColor: '#eb0a73',
                borderRadius: 0,
              }}
              buttonTextStyle={{
                ...styles.dropdown1BtnTxtStyle,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000',
              }}
              renderDropdownIcon={isOpened => {
                return (
                  <FontAwesome
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#444'}
                    size={16}
                  />
                );
              }}
              dropdownIconPosition={'left'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
            />
          </View>
          <View className="w-[75%] mx-auto">
            <SelectDropdown
              data={categoriesData}
              onSelect={(selectedItem, index) => {
                toggleCategory(selectedItem, index);
              }}
              defaultButtonText={'وقت الدوام'}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.arabic;
              }}
              rowTextForSelection={(item, index) => {
                return item.arabic;
              }}
              buttonStyle={{
                ...styles.dropdown1BtnStyle,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0.5,
                borderBottomColor: '#eb0a73',
                borderRadius: 0,
              }}
              buttonTextStyle={{
                ...styles.dropdown1BtnTxtStyle,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000',
              }}
              renderDropdownIcon={isOpened => {
                return (
                  <FontAwesome
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#444'}
                    size={16}
                  />
                );
              }}
              dropdownIconPosition={'left'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
            />
          </View>
          <TouchableOpacity onPress={() => setDaysOpen(false)} activeOpacity={1}>
          <View className="z-50 w-[75%] mx-auto">
            <DropDownPicker
              open={daysOpen}
              value={daysOfWorks}
              items={daysOfWork}
              setItems={setDaysOfWorks}
              setOpen={setDaysOpen}
              setValue={setDaysOfWorks}
              onClose={handleClose}
              theme="LIGHT"
              multiple={true}
              mode="BADGE"
              zIndex={3000}
              zIndexInverse={1000}
              language="AR"
              rtl={true}
              showBadgeDot={true}
              badgeDotColors={['red']}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              dropDownContainerStyle={{
                position: 'relative',
                top: 0,
              }}
              modalAnimationType="slide"
              placeholder="ايام الدوام"
              containerStyle={{
                borderWidth: 0,
              }}
              style={{
                height: 35,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0.5,
                borderBottomColor: '#000',
                borderRadius: 0,
              }}
              ArrowUpIconComponent={({style}) => (
                <FontAwesome name="chevron-up" color={'#444'} size={16} />
              )}
              ArrowDownIconComponent={({style}) => (
                <FontAwesome name="chevron-down" color={'#444'} size={16} />
              )}
              textStyle={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000',
                paddingRight: 5,
              }}
            />
          </View>
          </TouchableOpacity>

          <View className="mx-auto w-[75%] pt-7">
            <Text className="text-center text-lg font-semibold text-black">
              هل سجلت عن طريق مشترك في خطي ؟
            </Text>
            <TextInput
              style={{
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0.5,
                borderBottomColor: '#eb0a73',
                borderRadius: 0,
                paddingHorizontal: 0,
              }}
              // showSoftInputOnFocus={false}
              className="text-base font-bold text-center"
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              keyboardType="phone-pad"
              placeholder="رقم موبايل المشترك"
            />
          </View>
          <View className="pt-5">
            <TouchableOpacity
              onPress={() => {
                if (location) {
                  navigation.navigate('MapNew', {
                    taxiType,
                    typeOfWork,
                    daysOfWork: daysOfWorks,
                    genderType,
                    phoneNumber,
                    fromlocation: location,
                  });
                } else {
                  console.error(
                    'Location data is missing, cannot navigate to MapNew screen',
                  );
                  // You can show an error message to the user
                }
              }}
              className="h-10 w-[75%] mx-auto rounded-full">
              <LinearGradient
                // Button Linear Gradient
                colors={['#4b63ac', '#a05193', '#e51978']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[0, 0.5, 1]}
                angle={45}
                className="rounded-full"
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
                  اضف موقع الدوام على الخارطة
                  {ToLocation && (
                    <FontAwesome name="check" size={24} color="red" />
                  )}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            {showErrorMessage && (
              <Text
                style={{color: 'red', textAlign: 'center', marginBottom: 10}}>
                الرجاء ملء جميع الحقول المطلوبة قبل المتابعة
              </Text>
            )}

            <TouchableOpacity
              onPress={() => {
                if (!isNextButtonDisabled()) {
                  setShowErrorMessage(false);
                  navigation.navigate('VerifyInfo', {
                    ToLocation,
                    fromlocation: location,
                    taxiType,
                    typeOfWork,
                    daysOfWork: daysOfWorks,
                    genderType,
                    phoneNumber,
                  });
                } else {
                  setShowErrorMessage(true);
                }
              }}
              style={{
                alignSelf: 'center',
                marginBottom: 50,
                width: '50%',
                height: 50,
                borderRadius: 25,
                overflow: 'hidden',
              }}>
              <LinearGradient
                // Button Linear Gradient
                colors={['#4b63ac', '#a05193', '#e51978']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[0, 0.5, 1]}
                angle={45}
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
                  التالي
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default React.memo(RegularOrderScreen);

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},
  viewContainer: {flex: 1, width, backgroundColor: '#FFF'},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
    paddingBottom: '20%',
  },

  dropdown1BtnStyle: {
    width: '100%',
    height: 35,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'right'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'right'},

  dropdown2BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  dropdown2BtnTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdown2DropdownStyle: {
    backgroundColor: '#444',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdown2RowStyle: {backgroundColor: '#444', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  dropdown3BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#444',
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3BtnTxt: {
    color: '#444',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },
  dropdown3DropdownStyle: {backgroundColor: 'slategray'},
  dropdown3RowStyle: {
    backgroundColor: 'slategray',
    borderBottomColor: '#444',
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdownRowImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3RowTxt: {
    color: '#F1F1F1',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },

  dropdown4BtnStyle: {
    width: '50%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown4BtnTxtStyle: {color: '#444', textAlign: 'right'},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'right'},
});
