import React, { Component } from 'react'
import { View } from 'react-native'

class TestChildren extends Component {
  componentDidMount() {
    console.log('mount')
    
  }

  componentWillUnmount() {
    console.log('unmount')
  }

  render() {
    return (
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'pink',
          borderWidth:1 
        }}
      ></View>
    )
  }
}

export default TestChildren
