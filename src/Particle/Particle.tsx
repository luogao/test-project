import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  call,
  clockRunning,
  cond,
  Easing,
  interpolate,
  not,
  onChange,
  or,
  set,
  startClock,
  stopClock,
  timing,
} from 'react-native-reanimated'
type Props = {
  size?: number
  canvasWidth: number
  canvasHeight: number
}

const getRandom = (max: number, min?: number) => {
  return Math.max(Math.random() * max, min || 0)
}

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

    // call([state.position, config.toValue, state.time, state.frameTime, state.finished], (value) => {
    //   console.log(value)
    // }),
    state.position,
  ])
}
const Particle: FC<Props> = (props) => {
  const { size, canvasWidth, canvasHeight } = props
  const initX = getRandom(canvasWidth)
  const initY = getRandom(canvasHeight)

  const vx = getRandom(10, 5)
  const vy = getRandom(10, 5)
  const durationX = (initX / vx) * 100
  const durationY = (initY / vy) * 100
  const clockX = new Animated.Clock()
  const clockY = new Animated.Clock()

  const animationValue = runTiming({ clock: clockX, from: 0, to: 1, duration: 1000 })

  const translateX = interpolate(animationValue, { inputRange: [0, 1], outputRange: [initX, 0] })
  const translateY = interpolate(animationValue, { inputRange: [0, 8], outputRange: [initY, 0] })
  
  console.log('render')
  return (
    <>
      <Animated.View
        style={StyleSheet.flatten([
          styles.particle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          {
            transform: [
              {
                translateX,
                translateY,
              },
            ],
          },
        ])}
      ></Animated.View>
      <Animated.Code
        exec={Animated.block([
          // cond(
          //   or(not(clockRunning(clockX)), not(clockRunning(clockY))),
          //   [stopClock(clockX), stopClock(clockY)],
          //   []
          // ),
          // onChange(
          //   [not(clockRunning(clockX))],
          //   [
          //     call([not(clockRunning(clockX))], (value) => {
          //       console.log(value)
          //     }),
          //   ]
          // ),
        ])}
      />
    </>
  )
}

const styles = StyleSheet.create({
  particle: {
    backgroundColor: '#fff',
    position: 'absolute',
  },
})

export default Particle
