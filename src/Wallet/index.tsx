import React, { Component, useState } from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { usePanGestureHandler, withOffset, withDecay, diffClamp } from 'react-native-redash'
import Animated, {
  interpolate,
  Extrapolate,
  add,
  useCode,
  block,
  call,
} from 'react-native-reanimated'
import { StyleSheet, LayoutChangeEvent, Dimensions, Image } from 'react-native'

const cards = [1, 23, 4, 55, 61, 2, 77, 123123, 2, 2, 34, 5, 5]
const cardContentHeight = 200
const cardMargin = 20
const HEIGHT = cardContentHeight + cardMargin * 2

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 50,
  },
  card: {
    height: cardContentHeight,
    marginVertical: cardMargin,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.32,
    shadowRadius: 15.46,
    elevation: 9,
  },
})
const Height = Dimensions.get('screen').height

const Wallet = () => {
  const [containerHeight, setContainerHeight] = useState(Height)
  const visibleCards = Math.floor(containerHeight / HEIGHT)
  const { translation, state, velocity, gestureHandler } = usePanGestureHandler()
  console.log({ containerHeight })
  console.log({ visibleCards })
  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: { height },
      },
    } = event

    setContainerHeight(height)
  }

  const y = diffClamp(
    withDecay({
      value: translation.y,
      velocity: velocity.y,
      state,
    }),
    -HEIGHT * cards.length + visibleCards * HEIGHT,
    0
  )

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View style={[styles.container]} onLayout={handleContainerLayout}>
        {cards.map((_, index: number) => {
          const positionY = add(y, index * HEIGHT)
          const isDisappearing = -HEIGHT
          const isTop = 0
          const isBottom = HEIGHT * (visibleCards - 1)
          const isAppearing = HEIGHT * visibleCards
          const translateYWithScale = interpolate(positionY, {
            inputRange: [isBottom, isAppearing],
            outputRange: [0, -HEIGHT / 4],
            extrapolate: Extrapolate.CLAMP,
          })
          const translateY = add(
            interpolate(y, {
              inputRange: [-HEIGHT * index, 0],
              outputRange: [-HEIGHT * index, 0],
              extrapolate: Extrapolate.CLAMP,
            }),
            translateYWithScale
          )
          const scale = interpolate(positionY, {
            inputRange: [isDisappearing, isTop, isBottom, isAppearing],
            outputRange: [0.5, 1, 1, 0.5],
            extrapolate: Extrapolate.CLAMP,
          })
          const opacity = interpolate(positionY, {
            inputRange: [isDisappearing, isTop, isBottom, isAppearing],
            outputRange: [0, 1, 1, 0],
            extrapolate: Extrapolate.CLAMP,
          })

          return (
            <>
              <Animated.View
                key={index}
                style={[
                  styles.card,
                  {
                    opacity,
                    transform: [{ translateY }, { scale }],
                    backgroundColor: `#${(~~(Math.random() * (1 << 24))).toString(16)}`,
                  },
                ]}
              >
                <Image
                  source={{ uri: 'https://placeimg.com/640/480/any' }}
                  resizeMode='cover'
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    borderRadius: 10,
                  }}
                />
              </Animated.View>
            </>
          )
        })}
      </Animated.View>
    </PanGestureHandler>
  )
}

export default Wallet
