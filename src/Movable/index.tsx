import React, { Component } from 'react'
import { Dimensions, LayoutChangeEvent, View } from 'react-native'
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State as GestureState,
} from 'react-native-gesture-handler'
import Animated, {
  add,
  block,
  call,
  Clock,
  cond,
  divide,
  Easing,
  eq,
  set,
  stopClock,
  sub,
} from 'react-native-reanimated'
import { clamp, diffClamp, snapPoint, timing } from 'react-native-redash'

type Props = {
  padding?: number
}

const initY = 0

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

class Movable extends Component<Props> {
  static defaultProps = {
    padding: 20,
  }

  private clockX = new Clock()
  private clockY = new Clock()
  private contentWidth = new Animated.Value<number>(0)
  private contentHeight = new Animated.Value<number>(0)

  private visible = new Animated.Value<number>(0)
  private offsetX = new Animated.Value<number>(0)
  private offsetY = new Animated.Value<number>(0)
  private transX = new Animated.Value<number>(0)
  private transY = new Animated.Value<number>(0)
  private velocityX = new Animated.Value<number>(0)
  private velocityY = new Animated.Value<number>(0)
  private gestureState = new Animated.Value<GestureState>(GestureState.UNDETERMINED)

  private snapToX = snapPoint(this.transX, this.velocityX, [
    divide(sub(windowWidth, this.contentWidth, this.props.padding), -2),
    divide(sub(windowWidth, this.contentWidth, this.props.padding), 2),
  ])

  private snapToY = clamp(
    this.transY,
    divide(sub(windowHeight, this.contentHeight, this.props.padding + 50), -2),
    divide(sub(windowHeight, this.contentHeight, this.props.padding + 50), 2)
  )

  private handlePan = Animated.event<PanGestureHandlerGestureEvent>([
    {
      nativeEvent: ({ translationX: x, translationY: y, state, velocityX, velocityY }) =>
        block([
          set(this.gestureState, state),
          set(this.velocityX, velocityX),
          set(this.velocityY, velocityY),
          set(this.transX, add(this.offsetX, x)),
          set(this.transY, add(this.offsetY, y)),
          cond(eq(state, GestureState.ACTIVE), [stopClock(this.clockY), stopClock(this.clockX)]),
          cond(eq(state, GestureState.END), [
            set(
              this.transX,
              timing({
                clock: this.clockX,
                from: this.transX,
                to: this.snapToX,
                duration: 200,
                easing: Easing.inOut(Easing.ease),
              })
            ),
            set(this.offsetX, this.transX),

            set(
              this.transY,
              timing({
                clock: this.clockY,
                from: this.transY,
                to: this.snapToY,
                duration: 200,
                easing: Easing.inOut(Easing.ease),
              })
            ),
            set(this.offsetY, this.transY),
          ]),
        ]),
    },
  ])

  handleLayout = (event: LayoutChangeEvent) => {
    const { width, height, x, y } = event.nativeEvent.layout
    this.contentWidth.setValue(width)
    this.contentHeight.setValue(height)
    this.offsetX.setValue((windowWidth - this.props.padding - width) / 2)
     this.visible.setValue(1)
  }

  render() {
    return (
      <>
        <PanGestureHandler onGestureEvent={this.handlePan} onHandlerStateChange={this.handlePan}>
          <Animated.View
            onLayout={this.handleLayout}
            style={{
              opacity: this.visible,
              transform: [
                {
                  translateX: this.transX,
                },
                {
                  translateY: this.transY,
                },
              ],
            }}
          >
            {this.props.children}
          </Animated.View>
        </PanGestureHandler>
        
      </>
    )
  }
}

export default Movable
