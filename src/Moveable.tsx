import React, { Component } from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { event, Value, block, cond, eq, add, set, call } from 'react-native-reanimated';
import { clamp, withDecay } from 'react-native-redash';
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
class Moveable extends Component {

  private gestureY = new Value<number>(0)
  private gestureX = new Value<number>(0)
  private offsetX = new Value<number>(startPosition.x)
  private offsetY = new Value<number>(startPosition.y)
  private velocityY = new Value<number>(0)
  private velocityX = new Value<number>(0)
  private gestureState = new Value<State>(State.UNDETERMINED)


  private translateX = block([
    cond(eq(this.gestureState, State.END),
      [
        set(this.offsetX, add(this.offsetX, this.gestureX)),
        this.offsetX
      ],
      [
        add(this.offsetX, this.gestureX)
      ]
    ),
  ])

  private translateY = block([
    cond(eq(this.gestureState, State.END), [
      set(this.offsetY, add(this.offsetY, this.gestureY)),
      this.offsetY
    ], [
      add(this.offsetY, this.gestureY)
    ])
  ])


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
                translateX: this.position.x
              },
              {
                translateY: this.position.y
              }
            ]
          } }>

          </Animated.View>

        </PanGestureHandler>
        <Animated.Code exec={
          block([
            call([ this.translateX, this.translateY, this.position.x, this.position.y ], (value) => {
              console.log(value)
            })
          ])

        } />
      </>
    );
  }
}

export default Moveable;