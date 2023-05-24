import React, {useState, useCallback, useMemo} from 'react';
import {View, Pressable, Text, SafeAreaView} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation, useRoute} from '@react-navigation/native';

const DocumentComponent = React.memo(
  ({id, handleScan, scannedImages, shouldHighlight}) => {
    return (
      <View className="flex-row space-x-5 mx-auto mt-5">
        {['front', 'back'].map(side => (
          <Pressable
            key={side}
            onPress={() => handleScan(id, side)}
            className={`w-[40%] h-20 rounded-xl mx-auto my-auto flex-row ${
              shouldHighlight && !scannedImages[`${id}-${side}`]
                ? 'bg-red-500'
                : 'bg-blue-400'
            }`}>
            <View className="flex-row my-auto mx-auto">
              {scannedImages[`${id}-${side}`] && (
                <View className="mt-1 mr-2">
                  <Icon name="check" size={20} color="green" />
                </View>
              )}
              <Text className="text-center text-black text-lg">
                {id} {side === 'front' ? 'امام' : 'خلف'}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    );
  },
);

const FifthDocumentComponent = React.memo(
  ({handleScan, scannedImages, shouldHighlight}) => {
    return (
      <Pressable
        onPress={() => handleScan(5, 'front')}
        className={`w-[40%] h-20 rounded-xl mx-auto mt-5 flex-row bg-blue-400`}>
        <View className="flex-row my-auto mx-auto">
          {scannedImages[`5-front`] && (
            <View className="mt-1 mr-2">
              <Icon name="check" size={20} color="green" />
            </View>
          )}
          <Text className="text-center mx-auto text-black text-lg">
            الوكالة
          </Text>
        </View>
      </Pressable>
    );
  },
);

const ScanScreen = () => {
  const [scannedImages, setScannedImages] = useState({});
  const [shouldHighlight, setShouldHighlight] = useState(false);
  const route = useRoute();
  const {
    fullName,
    phoneNumber,
    password,
    signupoption,
    signinoption,
    locations,
    locationtitle,
    birthdate,
    deviceToken,
    cartype,
    carmodel,
    carcolor,
    carpassenger,
    carnumber,
    carnumberword,
    carnumberregion,
  } = route.params;

  const handleScan = useCallback(async (docId, side) => {
    const {scannedImages} = await DocumentScanner.scanDocument({
      croppedImageQuality: 100,
      letUserAdjustCrop: true,
      maxNumDocuments: 1,
    });

    if (scannedImages.length > 0) {
      setScannedImages(prevState => {
        const newScannedImages = {
          ...prevState,
          [`${docId}-${side}`]: scannedImages[0],
        };
        if (JSON.stringify(prevState) === JSON.stringify(newScannedImages)) {
          return prevState; // prevent unnecessary state update
        }
        return newScannedImages;
      });
    }
  }, []);

  const handleContinue = useCallback(() => {
    const requiredDocuments = [
      'بطاقة وطنية',
      'بطاقة سكن',
      'السنوية',
      'اجازة السوق',
    ];
    const allDocsScanned = requiredDocuments.every(docId =>
      ['front', 'back'].every(side => scannedImages[`${docId}-${side}`]),
    );

    if (!allDocsScanned) {
      setShouldHighlight(true);
    } else {
      console.log(scannedImages);
      navigation.navigate('PrfileImage', {
        fullName,
        phoneNumber,
        password,
        signupoption,
        signinoption,
        locations,
        locationtitle,
        birthdate,
        deviceToken,
        cartype,
        carmodel,
        carcolor,
        carpassenger,
        carnumber,
        carnumberword,
        carnumberregion,
        scannedImages,
      });
    }
  }, [scannedImages]);

  const navigation = useNavigation();

  const documents = useMemo(
    () => ['بطاقة وطنية', 'بطاقة سكن', 'السنوية', 'اجازة السوق'],
    [],
  );

  return (
    <SafeAreaView className="flex-col flex-1 bg-white">
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
      {documents.map(id => (
        <DocumentComponent
          key={id}
          id={id}
          handleScan={handleScan}
          scannedImages={scannedImages}
          shouldHighlight={shouldHighlight}
        />
      ))}
      <FifthDocumentComponent
        handleScan={handleScan}
        scannedImages={scannedImages}
        shouldHighlight={shouldHighlight}
      />

      <Pressable
        className="w-[40%] h-14 bg-yellow-300 mx-auto mt-auto bottom-5 rounded-full justify-center items-center"
        onPress={handleContinue}>
        <Text className="text-xl text-black font-bold">Continue</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default React.memo(ScanScreen);
