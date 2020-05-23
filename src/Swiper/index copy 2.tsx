import React from 'react'
import { Dimensions, StyleSheet, View, Image } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated, {
  add,
  and,
  clockRunning,
  cond,
  debug,
  divide,
  eq,
  floor,
  multiply,
  neq,
  not,
  onChange,
  set,
  sub,
  useCode,
  Easing,
  stopClock,
  abs,
  Value,
} from 'react-native-reanimated'
import {
  clamp,
  // snapPoint,
  timing,
  useClock,
  min,
  usePanGestureHandler,
  useValue,
} from 'react-native-redash'
import ImageViewer from './ImageViewer'

const { width, height } = Dimensions.get('window')
const snapPoint = (
  value: Animated.Adaptable<number>,
  velocity: Animated.Adaptable<number>,
  points: Animated.Adaptable<number>[]
) => {
  const point = add(value, multiply(0.2, velocity))
  const diffPoint = (p: Animated.Adaptable<number>) => abs(sub(point, p))
  const deltas = points.map((p) => diffPoint(p))
  const minDelta = min(...deltas)
  return points.reduce(
    (acc, p) => cond(eq(diffPoint(p), minDelta), p, acc),
    new Value()
  ) as Animated.Node<number>
}

export const assets = [
  require('./assets/3.jpg'),
  require('./assets/2.jpg'),
  require('./assets/4.jpg'),
  require('./assets/5.jpg'),
  require('./assets/1.jpg'),
]

const snapPoints = assets.map((_, i) => i * -width)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  pictures: {
    width: width * assets.length,
    height,
    flexDirection: 'row',
  },
  picture: {
    width,
    height,
    overflow: 'hidden',
  },
})

const Swiper = () => {
  const clock = useClock()
  const index = useValue(0)
  const offsetX = useValue(0)
  const translationX = useValue(0)

  const translateX = useValue(0)

  const { gestureHandler, state, velocity, translation } = usePanGestureHandler()
  const to = clamp(
    snapPoint(translateX, velocity.x, snapPoints),
    multiply(-width, add(index, 1)),
    multiply(-width, sub(index, 1))
  )

  useCode(
    () => [
      cond(eq(state, State.ACTIVE), [
        cond(clockRunning(clock), [stopClock(clock)]),
        set(translateX, add(offsetX, translation.x)),
      ]),
      cond(
        eq(state, State.END),
        [
          cond(not(clockRunning(clock)), [set(index, floor(divide(translateX, -width)))], []),
          set(
            translateX,
            timing({ clock, from: translateX, to, duration: 300, easing: Easing.out(Easing.ease) })
          ),
          set(offsetX, translateX),
        ],
        []
      ),
    ],
    []
  )
  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.pictures, { transform: [{ translateX }] }]}>
            {assets.map((source, i) => (
              <View key={source} style={styles.picture}>
                <Image
                  source={source}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    width: undefined,
                    height: undefined,
                    resizeMode: 'cover',
                  }}
                />
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export default Swiper
