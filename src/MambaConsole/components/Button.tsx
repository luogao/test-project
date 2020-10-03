import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleProp,
  TextStyle,
  ViewStyle,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native'

interface Props extends TouchableOpacityProps {
  onPress: (event: GestureResponderEvent) => void
  label: string
  labelStyle?: StyleProp<TextStyle>
  buttonStyle?: StyleProp<ViewStyle>
}

export default function Button(props: Props) {
  const { onPress, label, labelStyle, buttonStyle } = props

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: '#000',
  },
})
