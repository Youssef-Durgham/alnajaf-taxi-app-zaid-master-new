import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

const CustomRating = ({ rating, maxRating = 5, onRate }) => {
  const starElements = [];

  for (let i = 1; i <= maxRating; i++) {
    const isSelected = i <= rating;
    starElements.push(
      <TouchableOpacity
        key={i}
        onPress={() => {
          if (onRate) {
            onRate(i);
          }
        }}>
        <Text style={{ fontSize: 40, marginHorizontal: 5, color: isSelected ? '#FFD700' : '#CCCCCC' }}>
          ★
        </Text>
      </TouchableOpacity>
    );
  }

  return <View style={{ flexDirection: 'row' }}>{starElements}</View>;
};

export default React.memo(CustomRating);
