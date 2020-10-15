import React, { Component } from 'react'
import { Dimensions, LayoutChangeEvent } from 'react-native'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State as GestureState,
} from 'react-native-gesture-handler'
import Animated, {
  add,
  block,
  Clock,
  cond,
  Easing,
  eq,
  set,
  stopClock,
  sub,
} from 'react-native-reanimated'
import { clamp, snapPoint, timing } from 'react-native-redash'


function withDefaultProps<P extends object, DP extends Partial<P>> (
  dp: DP,
  component: React.ComponentType<P>,
) {
  component.defaultProps = dp;
  type RequiredProps = Omit<P, keyof DP>;
  return (component as React.ComponentType<any>) as React.ComponentType<
    RequiredProps & DP
  >;
}

const defaultProps = {
  padding: 20,
  initPostion: { left: 0, top: 0 }
}

type DefaultProps = Readonly<typeof defaultProps>

type Props = { initPostion: { left?: number, top?: number, bottom?: number, right?: number } } & DefaultProps

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const Movable = withDefaultProps(
  defaultProps,
  class extends Component<Props> {
    private clockX = new Clock()
    private clockY = new Clock()
    private contentWidth = new Animated.Value<number>(0)
    private contentHeight = new Animated.Value<number>(0)

    private getPaddingTop = () => {
      return this.props.padding
    }

    private getPaddingBottom = () => {
      return this.props.padding
    }
    private getPaddingLeft = () => {
      return this.props.padding
    }

    private getPaddingRight = () => {
      return this.props.padding
    }



    private visible = new Animated.Value<number>(0)
    private offsetX = new Animated.Value<number>(this.props.padding + this.props.initPostion.left)
    private offsetY = new Animated.Value<number>(this.props.padding + this.props.initPostion.top)
    private transX = new Animated.Value<number>(this.props.padding)
    private transY = new Animated.Value<number>(this.props.padding)
    private velocityX = new Animated.Value<number>(0)
    private velocityY = new Animated.Value<number>(0)
    private gestureState = new Animated.Value<GestureState>(GestureState.UNDETERMINED)



    private snapToX = snapPoint(this.transX, this.velocityX, [
      0 + this.getPaddingLeft(),
      sub(windowWidth, this.contentWidth, this.getPaddingRight())
    ])

    private snapToY = clamp(
      this.transY,
      0 + this.getPaddingTop(),
      sub(windowHeight, this.contentHeight, this.getPaddingBottom())
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
            cond(eq(state, GestureState.ACTIVE), [ stopClock(this.clockY), stopClock(this.clockX) ]),
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
      const { width, height } = event.nativeEvent.layout
      this.contentWidth.setValue(width)
      this.contentHeight.setValue(height)
      this.visible.setValue(1)
    }

    render () {
      return (
        <>
          <PanGestureHandler onGestureEvent={ this.handlePan } onHandlerStateChange={ this.handlePan }>
            <Animated.View
              onLayout={ this.handleLayout }
              style={ {
                zIndex: 999999,
                position: 'absolute',
                top: 0,
                left: 0,
                // right: this.props.padding || Movable.defaultProps.padding,
                // bottom: (this.props.padding || Movable.defaultProps.padding) + 50,
                opacity: this.visible,
                transform: [
                  {
                    translateX: this.transX,
                  },
                  {
                    translateY: this.transY,
                  },
                ],
              } }
            >
              { this.props.children }
            </Animated.View>
          </PanGestureHandler>

        </>
      )
    }
  })


export default Movable
