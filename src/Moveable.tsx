import React, { Component } from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { event, Value, block, cond, eq, add, set, call, Clock, } from 'react-native-reanimated';
import { clamp, withDecay, snapPoint, timing } from 'react-native-redash';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height
const boxWidth = 100
const boxHeight = 100
const startPosition = {
  x: -(windowWidth - boxWidth) / 2,
  y: (windowHeight - boxHeight) / 2
}
const endPosition = {
  x: (windowWidth - boxWidth) / 2,
  y: -(windowHeight - boxHeight) / 2
}

const snapPointsX = [ startPosition.x, endPosition.x ]
const snapPointsY = [ startPosition.y, endPosition.y ]
class Moveable extends Component {

  private gestureY = new Value<number>(0)
  private gestureX = new Value<number>(0)
  private offsetX = new Value<number>(startPosition.x)
  private offsetY = new Value<number>(startPosition.y)
  private velocityY = new Value<number>(0)
  private velocityX = new Value<number>(0)
  private gestureState = new Value<State>(State.UNDETERMINED)
  private translateX = new Value<number>(startPosition.x)
  private translateY = new Value<number>(startPosition.y)
  private clockX = new Clock()
  private clockY = new Clock()


  // private translateX = block([
  //   cond(
  //     eq(this.gestureState, State.END),
  //     [
  //       set(this.offsetX, add(this.offsetX, this.gestureX)),
  //       set(this.offsetX, timing({ clock: this.clock, from: this.offsetX, to: snapPoint(this.offsetX, this.velocityX, snapPoints) })),
  //       this.offsetX
  //     ],
  //     [

  //     ]
  //   ),
  //   cond(eq(this.gestureState, State.ACTIVE), [ add(this.offsetX, this.gestureX) ])
  // ])



  private position = {
    x: clamp(this.translateX, startPosition.x, endPosition.x),
    y: clamp(this.translateY, endPosition.y, startPosition.y),
  }

  handleGestureEvent = event([
    {
      nativeEvent: {
        translationY: this.gestureY,
        translationX: this.gestureX,
        velocityY: this.velocityY,
        velocityX: this.velocityX,
        state: this.gestureState,
      },
    },
  ])




  render () {
    return (
      <>
        <PanGestureHandler
          onGestureEvent={ this.handleGestureEvent }
          onHandlerStateChange={ this.handleGestureEvent }
        >
          <Animated.View style={ {
            width: boxWidth,
            height: boxHeight,
            backgroundColor: 'pink',
            position: 'absolute',
            zIndex: 1000,
            transform: [
              {
                translateX: this.translateX
              },
              {
                translateY: this.translateY
              }
            ]
          } }>
            { this.props.children }
          </Animated.View>

        </PanGestureHandler>
        <Animated.Code exec={
          block([
            call([ this.translateX, this.translateY, this.position.x, this.position.y ], (value) => {
              console.log(value)
            }),
            [
              cond(
                eq(this.gestureState, State.END),
                [
                  // y
                  set(this.translateY,  timing({ clock: this.clockY, from: this.translateY, to: clamp(this.translateY, endPosition.y, startPosition.y) })),
                  set(this.offsetY, this.translateY),
                  // x
                  set(this.translateX, timing({ clock: this.clockX, from: this.translateX, to: snapPoint(this.translateX, this.velocityX, snapPointsX) })),
                  set(this.offsetX, this.translateX),
                ],
                [

                ]
              ),
              cond(
                eq(this.gestureState, State.ACTIVE),
                [
                  // y
                  set(this.translateY, add(this.offsetY, this.gestureY)),
                  // x
                  set(this.translateX, add(this.offsetX, this.gestureX))
                ]
              )
            ]

          ])

        } />
      </>
    );
  }
}

export default Moveable;