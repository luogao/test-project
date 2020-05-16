import React, { Component } from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'

type Props = {
  Radius: number
  BGColor: string
  style?: StyleProp<ViewStyle>
}

class HalfCircle extends Component<Props> {
  render() {
    const { Radius, BGColor, style } = this.props
    return (
      <View
        style={[
          style,
          {
            width: Radius * 2,
            height: Radius,
            overflow: 'hidden',
          },
        ]}
      >
        <View
          style={{
            width: Radius * 2,
            height: Radius * 2,
            borderRadius: Radius,
            backgroundColor: BGColor,
            overflow: 'hidden',
          }}
        >
          {this.props.children}
        </View>
      </View>
    )
  }
}

export default HalfCircle
