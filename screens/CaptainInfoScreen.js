/* eslint-disable comma-dangle */
import React, {useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapboxNavigation from '@homee/react-native-mapbox-navigation';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import {Image, FlatList} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Mapbox from '../components/Mapbox';
import {ActivityIndicator} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const {width} = Dimensions.get('window');

const Navigation = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]); // state to hold the user data
  const [Selectedusers, setSelectedusers] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [origin, setOrigin] = useState([-122.084, 37.421998333333335]); // Set default origin
  const [destination, setDestination] = useState([
    -122.084, 37.421998333333335,
  ]); // Set default destination

  const handleButtonClick = newDestination => {
    setDestination(newDestination);
  };
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };
  useEffect(() => {
    const fetchData = async currentLocation => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('jwtToken');

        const res = await axios.get(
          'https://iawm31dh1b.execute-api.me-south-1.amazonaws.com/dev/order-userslocations',
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );

        // Separate users and destinations data
        const usersData = res.data.filter(
          item => !item._id.startsWith('destination'),
        );
        const destinationsData = res.data.filter(item =>
          item._id.startsWith('destination'),
        );

        // Sort users and destinations data based on distance
        const sortFunction = (a, b) => {
          const aLocation = a.location.coordinates;
          const bLocation = b.location.coordinates;
          return (
            getDistanceFromLatLonInKm(
              currentLocation[1],
              currentLocation[0],
              aLocation[1],
              aLocation[0],
            ) -
            getDistanceFromLatLonInKm(
              currentLocation[1],
              currentLocation[0],
              bLocation[1],
              bLocation[0],
            )
          );
        };
        usersData.sort(sortFunction);
        destinationsData.sort(sortFunction);

        // Combine users and destinations data and set it to state
        setUsers(usersData.concat(destinationsData));
        setIsLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error(error);
        setIsLoading(false); // Set loading state to false if an error occurs
      }
    };

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation([longitude, latitude]);

        await fetchData([longitude, latitude]);
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);
  console.log(users);
  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <ChevronLeftIcon size={35} strokeWidth={2.5} color={'#a05193'} />
        <Text style={styles.backText}>رجوع</Text>
      </Pressable>
      {/* <Button
        title="fff"
        onPress={() => handleButtonClick([-122.084, 37.422998333333335])}
      /> */}

      {currentLocation ? (
        <Mapbox
          key={`${currentLocation}-${destination}`}
          origin={currentLocation}
          destination={destination}
          Selectedusers={Selectedusers}
        />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}

      <View className="bg-white border-t border-slate-300">
        {isLoading ? (
          <View className="flex-row p-5">
            <View className="mr-4">
              <SkeletonPlaceholder>
                <SkeletonPlaceholder
                  width={width * 0.2}
                  height={width * 0.1}
                  borderRadius={20}
                />
              </SkeletonPlaceholder>
            </View>
            <View className="mr-4">
              <SkeletonPlaceholder>
                <SkeletonPlaceholder
                  width={width * 0.2}
                  height={width * 0.1}
                  borderRadius={20}
                />
              </SkeletonPlaceholder>
            </View>
            <View className="mr-4">
              <SkeletonPlaceholder>
                <SkeletonPlaceholder
                  width={width * 0.2}
                  height={width * 0.1}
                  borderRadius={20}
                />
              </SkeletonPlaceholder>
            </View>
            <View className="mr-4">
              <SkeletonPlaceholder>
                <SkeletonPlaceholder
                  width={width * 0.2}
                  height={width * 0.1}
                  borderRadius={20}
                />
              </SkeletonPlaceholder>
            </View>
          </View>
        ) : (
          <FlatList
            data={users}
            horizontal={true}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  handleButtonClick([
                    item.location.coordinates[0],
                    item.location.coordinates[1],
                  ]);
                  setSelectedusers(item._id);
                }}
                className="flex-row items-center m-4">
                {item.picture ? (
                  <Image
                    source={{uri: item.picture}}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-slate-400 justify-center items-center mr-1">
                    <Text className="text-lg font-bold text-white">
                      {item.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View>
                  <Text className="text-lg font-semibold mr-auto">
                    {item._id.startsWith('destination')
                      ? item.name
                      : item.name.split(' ')[0]}
                  </Text>

                  <Text className="text-sm text-gray-500">
                    {getDistanceFromLatLonInKm(
                      currentLocation[1],
                      currentLocation[0],
                      item.location.coordinates[1],
                      item.location.coordinates[0],
                    ).toFixed(2)}{' '}
                    km
                  </Text>

                  {/* <Text className="text-sm text-gray-500">
          {item.location.coordinates[0]}, {item.location.coordinates[1]}
        </Text> */}
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  backButton: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -1,
    color: '#a05193',
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(Navigation);
