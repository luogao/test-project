import React, { Component } from 'react'
import { StyleSheet, View, Button } from 'react-native'
import Animated, {
  call,
  clockRunning,
  cond,
  Easing,
  interpolate,
  timing,
  set,
  startClock,
  stopClock,
  not,
} from 'react-native-reanimated'
import { withTimingTransition, withTransition, timing as ReTiming } from 'react-native-redash'

interface TimingConfig {
  clock?: Animated.Clock
  from?: number
  to?: number
  duration?: number
  easing?: Animated.EasingFunction
}

function runTiming({
  clock = new Animated.Clock(),
  from = 0,
  to = 1,
  duration = 300,
  easing = Easing.linear,
}: TimingConfig) {
  const state = {
    time: new Animated.Value<number>(0),
    frameTime: new Animated.Value<number>(0),
    finished: new Animated.Value<number>(0),
    position: new Animated.Value<number>(from),
  }

  const config = {
    duration,
    toValue: new Animated.Value(to),
    easing,
  }

  return Animated.block([
    cond(not(clockRunning(clock)), [
      set(config.toValue, to),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(state.finished, 0),
      set(state.position, from),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, [
      set(config.toValue, to),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(state.finished, 0),
      set(state.position, from),
    ]),
    cond(
      not(clockRunning(clock)),
      [cond(not(state.finished), [set(state.frameTime, 0), set(state.time, 0)])],
      []
    ),

    call([state.position, config.toValue, state.time, state.frameTime, state.finished], (value) => {
      console.log(value)
    }),
    state.position,
  ])
}

class Timing extends Component {
  clock = new Animated.Clock()

  animationState = new Animated.Value<number>(0)
  animationValue = withTransition(this.animationState, { duration: 1300 })

  runAnimation = () => {
    this.animationState.setValue(1)
  }

  stopAnimation = () => {
    this.animationState.setValue(0)
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title='Run' onPress={this.runAnimation} />
        <Button title='Stop' onPress={this.stopAnimation} />

        <Animated.View
          style={[
            styles.box,
            {
              transform: [
                {
                  translateX: interpolate(this.animationValue, {
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.Code
          exec={Animated.block([
            cond(this.animationState, [startClock(this.clock)], [stopClock(this.clock)]),
          ])}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#595b83',
  },
})

export default Timing
