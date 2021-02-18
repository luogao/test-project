import React from 'react';
import { StyleSheet } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { abs, add, block, clockRunning, concat, cond, defined, eq, greaterOrEq, interpolate, multiply, neq, not, onChange, set, stopClock, sub, useCode } from 'react-native-reanimated';
import { mix, snapPoint, spring, useClock, useValue } from 'react-native-redash';
import { Svg, Path } from 'react-native-svg'
import { height } from '../constants';
import { curveTo, lineTo, moveTo } from '../SwingBall/svgHelper'


Animated.addWhitelistedNativeProps({ d: true })

const AnimatedPath = Animated.createAnimatedComponent(Path)

const SIZE = 150
const X_FACTOR = 0.2
const Y_FACTOR = 2.5

const MAX_HEIGHT = SIZE * Y_FACTOR



const StickyShape = () => {
  const moveY = useValue(0)
  const moveOffsetY = useValue(0)
  const gestureY = useValue(0)
  const velocityY = useValue(0)
  const gestureState = useValue(State.UNDETERMINED)
  const springClock = useClock()
  const isSticked = useValue<0 | 1>(1)
  const sticking = useValue(1)
  const stickingClock = useClock()
  const stickingClock1 = useClock()
  const isOnTop = useValue<0 | 1>(1)

  useCode(() => {
    return block([
      onChange(gestureState, [
        cond(neq(gestureState, State.ACTIVE), [ cond(greaterOrEq(abs(gestureY), height / 2), [ set(isOnTop, not(isOnTop)), set(moveY, 0) ]), ])
      ]),
      cond(neq(gestureState, State.ACTIVE), [
        set(isSticked, 1),
        cond(clockRunning(stickingClock1), stopClock(stickingClock1)),
        set(sticking, spring({ clock: stickingClock, from: sticking, to: 1 })),

        set(moveY, spring({
          clock: springClock,
          from: moveY,
          to: 0,
          velocity: velocityY
        })),
      ], [
        cond(clockRunning(springClock), [ stopClock(springClock) ], []),
        cond(clockRunning(stickingClock), stopClock(stickingClock)),
        cond(greaterOrEq(moveY, MAX_HEIGHT), [
          set(isSticked, 0),
          set(sticking, spring({ clock: stickingClock1, from: sticking, to: 0 })), ]),
        set(moveY, abs(gestureY))
      ]),
    ])
  }, [])

  const handleGestureEvent = Animated.event([
    {
      nativeEvent: {
        translationY: gestureY,
        velocityY: velocityY,
        state: gestureState,
      },
    },
  ])
  const progress = multiply(sticking, interpolate(moveY, { inputRange: [ 0, MAX_HEIGHT ], outputRange: [ 0, 1 ] }))

  const factor = { x: mix(progress, 0, X_FACTOR), y: mix(progress, 1, Y_FACTOR) }
  const p1 = { x: 0, y: 0 }
  const p2 = { x: SIZE, y: 0 }
  const p3 = {
    x: multiply(SIZE, sub(1, factor.x)),
    y: multiply(SIZE, factor.y)
  }
  const p4 = {
    x: multiply(SIZE, factor.x),
    y: multiply(SIZE, factor.y)
  }
  const paths = []
  moveTo(paths, p1.x, p1.y)
  lineTo(paths, p2.x, p2.y)
  curveTo(paths, {
    to: p3,
    c1: { x: p2.x, y: 0 },
    c2: { x: p3.x, y: 0 }
  })
  lineTo(paths, p4.x, p4.y)
  curveTo(paths, { to: p1, c1: { x: p4.x, y: 0 }, c2: { x: p1.x, y: 0 } })
  const D = paths.reduce((acc, c) => concat(acc, c))

  return (
    <Animated.View style={ [ styles.container, { transform: [ { rotate: cond(isOnTop, '0', '180deg') } ] } ] }>
      <PanGestureHandler onGestureEvent={ handleGestureEvent } onHandlerStateChange={ handleGestureEvent }>
        <Animated.View style={ [
          StyleSheet.absoluteFill,
          {
            transform: [ {
              translateY: multiply(sub(1, sticking), moveY)
            } ]
          }
        ] }>
          <Svg
            fill='red'
            style={ styles.svg }
            height='100%'
            width='100%'
          >
            <AnimatedPath fill='pink' d={ D } />
          </Svg>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

const styles = {
  container: {
    height: '100%',
    width: SIZE
  },
  svg: {
    position: 'absolute',
  }
}

export default StickyShape;