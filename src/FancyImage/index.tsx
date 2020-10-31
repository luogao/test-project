import React, { Component } from 'react'
import { View, Image, StyleSheet, StyleProp, ImageStyle } from 'react-native'
import Animated, {
  and,
  block,
  call,
  Clock,
  clockRunning,
  cond,
  Easing,
  Extrapolate,
  interpolate,
  not,
  onChange,
  set,
  startClock,
  timing,
  Value,
} from 'react-native-reanimated'

const imageSource = {
  uri: 'https://i.pinimg.com/originals/57/6e/91/576e91c59b9fe2ad1cfb05ac84e8633e.jpg',
}

interface LoopProps {
  clock?: Animated.Clock
  easing?: Animated.EasingFunction
  duration?: number
  boomerang?: boolean // 回旋镖
  autoStart?: boolean
  toValue?: number
}

const loopTiming = (loopConfig: LoopProps) => {
  const { clock, easing, duration, boomerang, autoStart, toValue = 1 } = {
    clock: new Clock(),
    easing: Easing.linear,
    duration: 250,
    boomerang: false,
    autoStart: true,
    ...loopConfig,
  }
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  }
  const config = {
    toValue: new Value(toValue),
    duration,
    easing,
  }

  return block([
    cond(and(not(clockRunning(clock)), autoStart ? 1 : 0), startClock(clock)),
    timing(clock, state, config),
    cond(state.finished, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      boomerang ? set(config.toValue, cond(config.toValue, 0, toValue)) : set(state.position, 0),
    ]),
    state.position,
  ])
}

class FancyImage extends Component {
  private animatedValue = loopTiming({
    duration: 15000,
    boomerang: true,
    toValue: 2,
  })

  private animationStyle: StyleProp<Animated.AnimateStyle<ImageStyle>> = {
    transform: [
      {
        scale: interpolate(this.animatedValue, {
          inputRange: [0, 2],
          outputRange: [1, 1.3],
          extrapolate: Extrapolate.CLAMP,
        }),
        translateX: interpolate(this.animatedValue, {
          inputRange: [0, 1, 2],
          outputRange: [0, -20, 0],
          extrapolate: Extrapolate.CLAMP,
        }),
        // translateY: interpolate(this.animatedValue, {
        //   inputRange: [0, 1, 2, 3],
        //   outputRange: [0, 0, -50, 0],
        //   extrapolate: Extrapolate.CLAMP,
        // }),
      },
    ],
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <Animated.Image
            style={StyleSheet.flatten([styles.image, this.animationStyle])}
            source={imageSource}
          />
        </View>
        <Animated.Code exec={Animated.block([])} />
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderWidth: 10,
    borderColor: '#f4abc4',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})

export default FancyImage
