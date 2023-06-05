import React, {createContext, useState, useEffect, useContext} from 'react';
import {Button, View, TouchableOpacity} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const YOUR_WEBSOCKET_SERVER = 'wss://server.joboncalls.com';

const LocationContext = createContext();

function LocationProvider({children}) {
  const [ws, setWs] = useState(null);
  const [reconnectIntervalId, setReconnectIntervalId] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [isExplicitlyClosed, setIsExplicitlyClosed] = useState(false); // Flag to track explicit closure
  const [location, setLocation] = useState({
    longitude: null,
    latitude: null,
  });
console.log(location)
  useEffect(() => {
    const fetchJwtToken = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      setJwtToken(token);
    };
    fetchJwtToken();
  }, []);

  const connectWebSocket = () => {
    console.log('done');
    const wsConnection = new WebSocket(`${YOUR_WEBSOCKET_SERVER}`);
    wsConnection.binaryType = 'blob';
    wsConnection.onopen = () => {
      console.log('WebSocket connection opened');
      wsConnection.send(JSON.stringify({token: jwtToken}));
      // Stop any existing reconnect attempts when successfully connected
      if (reconnectIntervalId) {
        clearInterval(reconnectIntervalId);
        setReconnectIntervalId(null);
      }
    };

    wsConnection.onerror = error => {
      console.log('WebSocket encountered an error:', error);
    };

    wsConnection.onclose = () => {
      console.log('WebSocket connection closed');

      if (!isExplicitlyClosed) {
        // Only attempt reconnect if not explicitly closed
        // Try to reconnect every 10 seconds if the connection is closed
        const id = setInterval(() => {
          console.log('Reconnecting WebSocket...');
          connectWebSocket();
        }, 5000);

        setReconnectIntervalId(id);
      } else {
        setIsExplicitlyClosed(false); // Reset the flag for future connections
      }
    };

    setWs(wsConnection);
  };

  const disconnectWebSocket = async () => {
    if (ws) {
      clearInterval(reconnectIntervalId); // Clear the reconnect interval
      await new Promise(resolve => {
        setIsExplicitlyClosed(true); // Set the flag to indicate explicit closure
        ws.onclose = () => resolve(); // Wait for WebSocket to fully close before continuing
        ws.close();
      });
      setWs(null);
      setReconnectIntervalId(null);
    }
  };

  useEffect(() => {
    if (ws && jwtToken) {
      // Send location updates when WebSocket connection is established
      const id = setInterval(() => {
        Geolocation.getCurrentPosition(
          position => {
            updateLocation({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            });
            ws.send(
              JSON.stringify({
                token: jwtToken,
                location: {
                  type: 'Point',
                  coordinates: [
                    position.coords.longitude,
                    position.coords.latitude,
                  ],
                },
              }),
            );
          },
          error => {
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      }, 3000);
      return () => clearInterval(id); // Clear the interval on cleanup
    }
  }, [ws, jwtToken]);

  const startSendingLocation = () => {
    if (!ws && jwtToken) {
      connectWebSocket();
    }
  };

  const stopSendingLocation = () => {
    if (ws) {
      disconnectWebSocket();
    }
  };

  const updateLocation = position => {
    setLocation(position);
  };

  return (
    <LocationContext.Provider
      value={{
        startSendingLocation,
        stopSendingLocation,
        updateLocation,
      }}>
      {children}
    </LocationContext.Provider>
  );
}

export {LocationContext, LocationProvider};
