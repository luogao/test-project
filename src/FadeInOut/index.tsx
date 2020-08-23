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

class index extends Component<Props, State> {
  private opacityValue: Animated.Value

  constructor(props: Props) {
    super(props)
    this.opacityValue = new Animated.Value(this.props.visible ? 1 : 0)
    this.state = {
      renderChildren: this.props.unmountChildrenWhenInvisible ? this.props.visible : true,
    }
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props

    if (!prevProps.visible && visible) {
      this.show(this.props)
    }
    if (prevProps.visible && !visible) {
      this.hide(this.props)
    }
  }

  show = (props) => {
    this.setState(
      {
        renderChildren: true,
      },
      () => {
        Animated.timing(this.opacityValue, {
          toValue: 1,
          duration: 500,
        })
      }
    )
  }

  hide = (props) => {
    Animated.timing(this.opacityValue, {
      toValue: 0,
      duration: 500,
    }).start(() => {
      if (this.props.unmountChildrenWhenInvisible && this.state.renderChildren) {
        this.setState({
          renderChildren: false,
        })
      }
    })
  }

  renderContent = () => {
    if (!this.state.renderChildren) return null
    return this.props.children
  }

  render() {
    console.log(this.state)

    return (
      <Animated.View style={{ opacity: this.opacityValue }}>{this.renderContent()}</Animated.View>
    )
  }
}

export default index
