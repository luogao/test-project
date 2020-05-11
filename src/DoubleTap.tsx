import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native'

import {
  LongPressGestureHandler,
  ScrollView,
  State,
  TapGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler'

import { LoremIpsum } from './common'
const windowWidth = Dimensions.get('window').width
const circleRadius = 30

export class PressBox extends Component {
  doubleTapRef = React.createRef<TapGestureHandler>()
  _touchX = new Animated.Value(windowWidth / 2 - circleRadius)
  _onPanGestureEvent = Animated.event([{ nativeEvent: { x: this._touchX } }], {
    useNativeDriver: false,
  })
  _onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      alert("I'm being pressed for so long")
    }
  }

  _onSingleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      alert("I'm touched")
    }
  }

  _onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      alert('D0able tap, good job!')
    }
  }

  render() {
    return (
      <LongPressGestureHandler
        onHandlerStateChange={this._onHandlerStateChange}
        minDurationMs={800}
      >
        <TapGestureHandler
          numberOfTaps={2}
          onHandlerStateChange={this._onSingleTap}
          waitFor={this.doubleTapRef}
        >
          <PanGestureHandler onGestureEvent={this._onPanGestureEvent}>
            <TapGestureHandler
              ref={this.doubleTapRef}
              onHandlerStateChange={this._onDoubleTap}
              numberOfTaps={2}
            >
              <View style={styles.box}>
                <Animated.View
                  style={[
                    {
                      backgroundColor: '#42a5f5',
                      borderRadius: circleRadius,
                      height: circleRadius * 2,
                      width: circleRadius * 2,
                    },
                    {
                      transform: [
                        {
                          translateX: Animated.add(this._touchX, new Animated.Value(-circleRadius)),
                        },
                      ],
                    },
                  ]}
                />
              </View>
            </TapGestureHandler>
          </PanGestureHandler>
        </TapGestureHandler>
      </LongPressGestureHandler>
    )
  }
}

export default class Example extends Component {
  render() {
    return (
      <ScrollView style={styles.scrollView}>
        <LoremIpsum words={40} style={{ color: '#000' }} />
        <PressBox />
        <LoremIpsum style={{ color: '#000' }} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 1,
  },
  box: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    backgroundColor: 'plum',
    margin: 10,
    zIndex: 200,
  },
})
