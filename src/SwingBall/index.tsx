import React, { Component } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
  block,
  call,
  clockRunning,
  concat,
  cond,
  Easing,
  Extrapolate,
  interpolate,
  not,
  set,
} from 'react-native-reanimated'
import { loop, spring } from 'react-native-redash'
import Svg, { Path } from 'react-native-svg'
import { curveTo, moveTo } from './svgHelper'

const AnimatedPath = Animated.createAnimatedComponent(Path)

const BallSize = 56

const ContainerWidth = BallSize
const ContainerHeight = 100 + BallSize

type Props = {
  containerStyle?: StyleProp<Animated.AnimateStyle<ViewStyle>>
}

class index extends Component<Props> {
  private fallingClock = new Animated.Clock()
  private fallingAnimationValue = new Animated.Value<number>(0)
  private swingAnimationValue = new Animated.Value<number>(0)

  private c1_to = {
    x: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 0.5, 1],
      outputRange: [ContainerWidth / 2, 0, ContainerWidth / 2],
      extrapolate: Extrapolate.CLAMP,
    }),
    y: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 1],
      outputRange: [0, ContainerHeight],
      extrapolate: Extrapolate.CLAMP,
    }),
  }

  private c1_p1 = {
    x: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 0.5, 1],
      outputRange: [ContainerWidth / 2, ContainerWidth, ContainerWidth / 2],
      extrapolate: Extrapolate.CLAMP,
    }),
    y: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 1],
      outputRange: [0, ContainerHeight],
      extrapolate: Extrapolate.CLAMP,
    }),
  }

  private c1_p2 = {
    x: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 1],
      outputRange: [ContainerWidth / 2, ContainerWidth / 2],
      extrapolate: Extrapolate.CLAMP,
    }),
    y: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 1],
      outputRange: [0, ContainerHeight],
      extrapolate: Extrapolate.CLAMP,
    }),
  }

  private c2_to = {
    x: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 0.5, 1, 1.5, 2],
      outputRange: [ContainerWidth / 2, 0, ContainerWidth / 2, 0, ContainerWidth / 2],
      extrapolate: Extrapolate.CLAMP,
    }),
    y: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 2],
      outputRange: [0, ContainerHeight],
      extrapolate: Extrapolate.CLAMP,
    }),
  }

  private c2_p1 = {
    x: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 0.5, 1, 1.5, 2],
      outputRange: [
        ContainerWidth / 2,
        ContainerWidth,
        ContainerWidth / 2,
        ContainerWidth,
        ContainerWidth / 2,
      ],
      extrapolate: Extrapolate.CLAMP,
    }),
    y: interpolate(this.fallingAnimationValue, {
      inputRange: [1, 2],
      outputRange: [ContainerHeight * 0.5, ContainerHeight],
      extrapolate: Extrapolate.CLAMP,
    }),
  }

  private c2_p2 = {
    x: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 2],
      outputRange: [ContainerWidth / 2, ContainerWidth / 2],
      extrapolate: Extrapolate.CLAMP,
    }),
    y: interpolate(this.fallingAnimationValue, {
      inputRange: [0, 2],
      outputRange: [0, ContainerHeight],
      extrapolate: Extrapolate.CLAMP,
    }),
  }

  private fallAnimationStyle: StyleProp<Animated.AnimateStyle<ViewStyle>> = {
    transform: [
      {
        translateY: interpolate(this.fallingAnimationValue, {
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
      },
    ],
  }

  private swingAnimationStyle: StyleProp<Animated.AnimateStyle<ViewStyle>> = {
    transform: [
      { translateY: -(100 + BallSize) },
      {
        rotate: concat(
          interpolate(this.swingAnimationValue, {
            inputRange: [0, 1],
            outputRange: [10, -10],
          }),
          'deg'
        ),
      },
      { translateY: 100 + BallSize },
    ],
  }

  private getD = () => {
    const commands: Animated.Node<string>[] = []
    moveTo(commands, ContainerWidth / 2, 0)
    curveTo(commands, {
      to: this.c1_to,
      c1: this.c1_p1,
      c2: this.c1_p2,
    })
    // curveTo(commands, {
    //   to: this.c2_to,
    //   c1: this.c2_p1,
    //   c2: this.c2_p2,
    // })
    const d = commands.reduce((acc, c) => concat(acc, c))
    return d
  }

  c1 = [10, 70]
  c2 = [100, 90]
  c3 = [60, 140]
  c4 = [20, 230]
  c5 = [90, 230]

  render() {
    const d = this.getD()
    return (
      <>
        <Animated.View
          style={StyleSheet.flatten([
            styles.container,
            this.swingAnimationStyle,
            this.props.containerStyle,
          ])}
        >
          <Svg
            fill='transparent'
            stroke='red'
            style={styles.svgContainer}
            height='100%'
            width='100%'
            viewBox='0 0 56 156'
          >
            <AnimatedPath d={d} stroke='black' strokeWidth={2} />
          </Svg>
          <Animated.View style={StyleSheet.flatten([styles.ball, this.fallAnimationStyle])} />
        </Animated.View>
        <Animated.Code
          exec={block([
            set(
              this.fallingAnimationValue,
              spring({
                clock: this.fallingClock,
                from: this.fallingAnimationValue,
                to: 1,
                config: {
                  stiffness: 130,
                },
              })
            ),
            set(
              this.swingAnimationValue,
              loop({ duration: 1000, easing: Easing.inOut(Easing.ease), boomerang: true })
            ),
          ])}
        />
      </>
    )
  }
  shouldComponentUpdate() {
    return false
  }
}

const styles = StyleSheet.create({
  svgContainer: {
    position: 'absolute',
  },
  container: {
    // borderWidth: 1,
    height: 100 + BallSize,
    width: BallSize,
    position: 'absolute',
    top: 50,
    zIndex: 9,
    alignItems: 'center',
  },
  ball: {
    width: BallSize,
    height: BallSize,
    borderRadius: BallSize / 2,
    backgroundColor: '#fd3a69',
  },
  line: {
    width: 1,
    position: 'absolute',
    height: '100%',
    top: 0,
    backgroundColor: '#000',
  },
})

export default index
