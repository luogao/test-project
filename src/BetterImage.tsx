import React, { Component } from 'react'
import { View, Image, StyleProp, ImageStyle, ViewStyle } from 'react-native'
import Animated, { Easing } from 'react-native-reanimated'
import { timing, withTimingTransition } from 'react-native-redash'

type Props = { source: string }
type State = { prevSource: string }

class BetterImage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      prevSource: '',
    }
  }

  animationState = new Animated.Value<0 | 1>(0)
  animationValue = withTimingTransition(this.animationState, { duration: 300 })

  containerStyle: StyleProp<ViewStyle> = {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  }

  animatedContainerStyle: StyleProp<Animated.AnimateStyle<ViewStyle>> = {
    width: 100,
    height: 100,
  }

  imageStyle: StyleProp<ImageStyle> = {
    width: 100,
    height: 100,
    position: 'absolute',
  }

  opacity = Animated.interpolate(this.animationValue, {
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  handleOnLoad = () => {
    console.log('onLoad')
    this.animationState.setValue(1)
  }

  handleOnProgress = () => {
    console.log('handleOnProgress')
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.source !== this.props.source && nextProps.source !== this.state.prevSource) {
      this.setState({
        prevSource: this.props.source,
      })
    }
  }

  handleFinished = () => {
    console.log('animation finished!')
    this.setState({
      prevSource: '',
    })
  }
  render() {
    return (
      <View style={[this.containerStyle]}>
        {/* 第一张 */}
        <Animated.View style={[this.animatedContainerStyle, { opacity: this.opacity }]}>
          <Image
            onLoad={this.handleOnLoad}
            onProgress={this.handleOnProgress}
            style={[this.imageStyle]}
            resizeMethod='resize'
            resizeMode='cover'
            source={{ uri: this.props.source }}
          />
        </Animated.View>
        {/* 第二张 */}
        {!!this.state.prevSource && (
          <WillHideImage source={this.state.prevSource} onFinished={this.handleFinished} />
        )}
      </View>
    )
  }
}

class WillHideImage extends Component<{ source: string; onFinished: () => void }> {
  animationState = new Animated.Value<0 | 1>(0)
  animationValue = new Animated.Value<0 | 1>(0)
  clock = new Animated.Clock()

  animatedContainerStyle: StyleProp<Animated.AnimateStyle<ViewStyle>> = {
    width: 100,
    height: 100,
    position: 'absolute',
  }

  imageStyle: StyleProp<ImageStyle> = {
    width: 100,
    height: 100,
    position: 'absolute',
    zIndex: 100,
  }

  opacity = Animated.interpolate(this.animationValue, {
    inputRange: [0, 1],
    outputRange: [1, 0],
  })

  handleOnLoad = () => {
    console.log('onLoad')
    this.animationState.setValue(1)
  }

  handleOnProgress = () => {
    console.log('handleOnProgress')
  }

  render() {
    return (
      <>
        <Animated.View style={[this.animatedContainerStyle, { opacity: this.opacity }]}>
          <Image
            onLoad={this.handleOnLoad}
            onProgress={this.handleOnProgress}
            style={[this.imageStyle]}
            resizeMethod='resize'
            resizeMode='cover'
            source={{ uri: this.props.source }}
          />
        </Animated.View>
        <Animated.Code
          exec={Animated.block([
            Animated.cond(this.animationState, [
              Animated.set(
                this.animationValue,
                timing({
                  clock: this.clock,
                  from: 0,
                  to: 1,
                  duration: 300,
                  easing: Easing.inOut(Easing.ease),
                })
              ),
              Animated.cond(Animated.not(Animated.clockRunning(this.clock)), [
                Animated.call([], () => {
                  this.props.onFinished()
                }),
              ]),
            ]),
          ])}
        />
      </>
    )
  }

  shouldComponentUpdate(nextProps: { source: string; onFinished: () => void }) {
    return nextProps.source !== this.props.source
  }
}

export default BetterImage
