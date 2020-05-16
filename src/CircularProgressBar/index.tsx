import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import HalfCircle from './HalfCircle'
import { transformOrigin } from 'react-native-redash'
import Animated from 'react-native-reanimated'
const { multiply, interpolate, Extrapolate, concat, lessThan } = Animated

type Props = {
  backgroundColor: string
  barColor: string
  trackColor?: string
  Radius: number
  BarSize: number
  process: Animated.Node<number>
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

class CircularProgressBar extends Component<Props> {
  render() {
    const { backgroundColor, barColor, Radius, process, BarSize = 10, trackColor } = this.props
    const theta = multiply(process, Math.PI * 2)
    const opacity = lessThan(theta, Math.PI)

    const rotate = interpolate(theta, {
      inputRange: [Math.PI, Math.PI * 2],
      outputRange: [0, Math.PI],
      extrapolate: Extrapolate.CLAMP,
    })
    return (
      <View style={[styles.container]}>
        <HalfCircle Radius={Radius} BGColor='transparent' style={{ zIndex: 1, overflow: 'hidden' }}>
          <HalfCircle Radius={Radius} BGColor={barColor} />

          <Animated.View
            style={{
              opacity,
              position: 'absolute',
              transform: [
                { translateY: Radius / 2 },
                { rotate: theta },
                { scale: 1.1 },
                { translateY: -Radius / 2 },
              ],
            }}
          >
            <HalfCircle BGColor={trackColor || backgroundColor} Radius={Radius} />
          </Animated.View>
        </HalfCircle>

        <HalfCircle
          Radius={Radius}
          BGColor='transparent'
          style={{
            transform: [{ rotate: '180deg' }],
          }}
        >
          <HalfCircle Radius={Radius} BGColor={barColor} />

          <Animated.View
            style={{
              position: 'absolute',
              transform: [
                { translateY: Radius / 2 },
                { rotate: rotate },
                { scale: 1.1 },
                { translateY: -Radius / 2 },
              ],
            }}
          >
            <HalfCircle BGColor={trackColor || backgroundColor} Radius={Radius} />
          </Animated.View>
        </HalfCircle>

        <View
          style={{
            zIndex: 2,
            position: 'absolute',
            borderRadius: Radius,
            width: (Radius - BarSize) * 2,
            height: (Radius - BarSize) * 2,
            backgroundColor: backgroundColor,
          }}
        />
      </View>
    )
  }
}

export default CircularProgressBar
