import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image } from 'react-native'

class SmallImage extends Component<{ item: any; onPress: (item: any) => void }> {
  handlePress = () => {
    this.props.onPress(this.props.item)
  }

  render() {
    const { item } = this.props
    return (
      <TouchableOpacity
        onPress={this.handlePress}
        style={{
          borderWidth: 1,
          borderColor:'#000',
          width: 50,
          height: 50,
          marginBottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          style={{
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          source={{ uri: item }}
        />
      </TouchableOpacity>
    )
  }
}

export default SmallImage
