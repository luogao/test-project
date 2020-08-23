import React, { Component } from 'react'
import { View, Animated } from 'react-native'
import { getPlatformElevation } from '../utils'

type Props = {
  visible: boolean
  unmountChildrenWhenInvisible?: boolean
}

type State = {
  renderChildren: boolean
}

enum AnimationState {
  inactive = 0,
  showing,
  hiding,
}

class index extends Component<Props, State> {
  private opacityValue: Animated.Value
  private animationState: AnimationState = AnimationState.inactive

  constructor(props: Props) {
    super(props)
    this.opacityValue = new Animated.Value(this.props.visible ? 1 : 0)
    this.state = {
      renderChildren: this.props.unmountChildrenWhenInvisible ? this.props.visible : true,
    }
    this.opacityValue.addListener((value) => {
      console.log(value)
    })
  }

  componentDidUpdate(prevProps: Props) {
    const { visible } = this.props
    if (visible !== prevProps.visible) {
      if (!prevProps.visible && visible) {
        if (this.animationState === AnimationState.inactive) {
          this.show(this.props)
        } else if (this.animationState === AnimationState.hiding) {
          this.opacityValue.stopAnimation(() => {
            this.show(this.props)
          })
        }
      }
      if (prevProps.visible && !visible) {
        if (this.animationState === AnimationState.inactive) {
          this.hide(this.props)
        } else if (this.animationState === AnimationState.showing) {
          this.opacityValue.stopAnimation(() => {
            this.hide(this.props)
          })
        }
      }
    }
  }

  show = (props) => {
    this.setState(
      {
        renderChildren: true,
      },
      () => {
        this.animationState = AnimationState.showing
        Animated.timing(this.opacityValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          this.animationState = AnimationState.inactive
        })
      }
    )
  }

  hide = (props) => {
    this.animationState = AnimationState.hiding
    Animated.timing(this.opacityValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      this.animationState = AnimationState.inactive
      if (this.props.unmountChildrenWhenInvisible && this.state.renderChildren) {
        this.setState({
          renderChildren: false,
        })
      }
    })
  }

  renderContent = () => {
    if (!this.state.renderChildren) return null
    return React.cloneElement(React.Children.only(this.props.children) as React.ReactElement<any>, {
      fadeInOutAnimationValue: this.opacityValue,
    })
  }

  render() {
    return (
      <Animated.View style={{ opacity: this.opacityValue }}>{this.renderContent()}</Animated.View>
    )
  }
}

export default index
