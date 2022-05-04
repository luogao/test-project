import React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import { TouchWithFeedback } from '.'

export default class TouchWithFeedbackDemo extends React.Component {
  handleGetAnimationStyle = (
    animationValue: Animated.Value<number>
  ): StyleProp<Animated.AnimateStyle<ViewStyle>> => {
    return {
      transform: [
        {
          scale: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.9],
          }), // 收缩效果
        },
      ],
      opacity: animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.8],
      }), // 透明度从1 - 0.8
    }
  }

  handlePress = () => {
    console.log('yes ~')
  }

  render() {
    return (
      <TouchWithFeedback
        getAnimationStyle={this.handleGetAnimationStyle}
        onPress={this.handlePress}
      >
        <View
          style={{
            padding: 10,
            backgroundColor: 'red',
          }}
        >
          <Text>点击我</Text>
        </View>
      </TouchWithFeedback>
    )
  }
}
