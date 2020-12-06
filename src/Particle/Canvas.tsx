import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { width } from '../constants'

type Props = {
  width: number
  height: number
}

const Canvas: FC<Props> = (props) => {
  const { width, height } = props
  return (
    <View style={StyleSheet.flatten([styles.canvas, { width, height }])}>{props.children}</View>
  )
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: '#000',
    position: 'relative',
  },
})
export default Canvas
