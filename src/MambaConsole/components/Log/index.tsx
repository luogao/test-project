import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { LogItemType } from '../../types/log'
import Item from './Item'

type Props = {
  logs: LogItemType[]
}

class index extends Component<Props> {
  renderItem = (item: LogItemType, index: number) => {
    console.log(item)
    return <Item {...item} key={index} />
  }

  render() {
    return <ScrollView>{this.props.logs.map(this.renderItem)}</ScrollView>
  }
}

export default index
