import React, { Component } from 'react'
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
  Clock,
  event,
  block,
  spring,
  timing,
  startClock,
  greaterThan,
  round,
  min,
  max,
  call,
} from 'react-native-reanimated'
import {
  clamp,
  // snapPoint,
  useClock,
  usePanGestureHandler,
  useValue,
} from 'react-native-redash'

const { width, height } = Dimensions.get('window')

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

const TRUE = 1
const FALSE = 0
const NOOP = 0
const UNSET = -1
const DIRECTION_RIGHT = -1
const DIRECTION_LEFT = 1
const SPRING_VELOCITY_SCALE = 1
const SWIPE_DISTANCE_MINIMUM = 20
const SPRING_CONFIG = {
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
}
const TIMING_CONFIG = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
}

type Props = {
  initIndex: number
}
export default class Swiper extends Component<Props> {
  static defaultProps = {
    initIndex: 0,
  }

  private clock = new Clock()
  private index = new Value(0)
  private offsetX = new Value(0)
  private gestureX = new Value(0)

  private velocityX = new Value(0)
  private isSwiping = new Value(FALSE)
  private isSwipeGesture = new Value(FALSE)
  private gestureState = new Value(State.UNDETERMINED)
  private springVelocityScale = new Value(SPRING_VELOCITY_SCALE)
  private swipeVelocityImpact = 2

  // Current progress of the page (translateX value)
  private progress = new Value(
    // Initial value is based on the index and page width
    this.props.initIndex * width * DIRECTION_RIGHT
  )
  private indexAtSwipeEnd = new Value(this.props.initIndex)
  private initialVelocityForSpring = new Value(0)

  private transitionTo = (index: Animated.Node<number>) => {
    const toValue = new Value(0)
    const frameTime = new Value(0)

    const state = {
      position: this.progress,
      time: new Value(0),
      finished: new Value(FALSE),
    }

    return block([
      // init
      cond(clockRunning(this.clock), NOOP, [
        // Animation wasn't running before
        // Set the initial values and start the clock
        set(toValue, multiply(index, width, DIRECTION_RIGHT)),
        set(frameTime, 0),
        set(state.time, 0),
        set(state.finished, FALSE),
        set(this.index, index),
      ]),

      cond(this.isSwipeGesture, [
        cond(
          not(clockRunning(this.clock)),
          [
            set(this.initialVelocityForSpring, multiply(this.velocityX, this.springVelocityScale)),
            cond(not(clockRunning(this.clock)), startClock(this.clock)),
            spring(
              this.clock,
              { ...state, velocity: this.initialVelocityForSpring },
              { ...SPRING_CONFIG, toValue }
            ),
          ],
          timing(this.clock, { ...state, frameTime }, { ...TIMING_CONFIG, toValue })
        ),
      ]),
      cond(state.finished, [
        // Reset values
        set(this.isSwipeGesture, FALSE),
        set(this.gestureX, 0),
        set(this.velocityX, 0),
        // When the animation finishes, stop the clock
        stopClock(this.clock),
        call([], () => {
          // alert('clock stoped!')
        }),
      ]),
    ])
  }

  private extrapolatedPosition = add(
    this.gestureX,
    multiply(this.velocityX, this.swipeVelocityImpact)
  )

  private calcTransitionToIndex = () => {
    return block([
      cond(
        and(
          greaterThan(abs(this.gestureX), SWIPE_DISTANCE_MINIMUM),
          greaterThan(abs(this.extrapolatedPosition), divide(width, 2))
        ),
        [
          round(
            min(
              max(
                0,
                sub(
                  this.index,
                  cond(greaterThan(this.extrapolatedPosition, 0), DIRECTION_LEFT, DIRECTION_RIGHT)
                )
              ),
              sub(assets.length, 1)
            )
          ),
        ],
        this.index
      ),
    ])
  }

  private handleGestureEvent = event([
    {
      nativeEvent: {
        translationX: this.gestureX,
        velocityX: this.velocityX,
        state: this.gestureState,
      },
    },
  ])

  private translateX = block([
    cond(
      eq(this.gestureState, State.ACTIVE),
      [
        // 👴 is Active start
        cond(this.isSwiping, NOOP, [
          // We weren't dragging before, set it to true
          set(this.isSwiping, TRUE),
          set(this.isSwipeGesture, TRUE),
          // Also update the drag offset to the last progress
          set(this.offsetX, this.progress),
        ]),
        set(this.progress, add(this.offsetX, this.gestureX)),
        stopClock(this.clock),
        // 👴 is Active end
      ],
      [
        // 👴 not Active start
        set(this.isSwiping, FALSE),
        // set(this.indexAtSwipeEnd, this.index),
        this.transitionTo(this.calcTransitionToIndex()),
        // 👴 not Active end
      ]
    ),
    this.progress,
  ])

  render() {
    return (
      <View style={styles.container}>
        <PanGestureHandler
          onGestureEvent={this.handleGestureEvent}
          onHandlerStateChange={this.handleGestureEvent}
        >
          <Animated.View style={StyleSheet.absoluteFill}>
            <Animated.View
              style={[styles.pictures, { transform: [{ translateX: this.translateX }] }]}
            >
              {assets.map((source, i) => (
                <View key={source} style={styles.picture}>
                  <Image
                    resizeMethod='resize'
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
}
