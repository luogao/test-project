import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { LogDetail, LogItemType, LogType } from '../../types/log'
import { capitalized } from '../../utils'

type Props = LogItemType

class Item extends Component<Props> {
  renderLogItem = () => {}

  renderDebugItem = () => {}

  renderInfoItem = () => {}

  renderWranItem = () => {}

  renderLogDetail = () => {
    const { data } = this.props
    return data
  }

  render() {
    const typedWrapperStyle = styles[`itemWrapper${capitalized(this.props.type)}`]
    const typedLabelStyle = styles[`itemLabel${capitalized(this.props.type)}`]
    return (
      <View style={[styles.itemWrapperCommon, typedWrapperStyle]}>
        <Text style={[styles.itemLabelCommon, typedLabelStyle]}>{this.renderLogDetail()}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemWrapperCommon: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  itemLabelCommon: {
    fontSize: 13,
    color: '#000',
  },
  itemWrapperLog: {},
  itemWrapperInfo: {},
  itemWrapperDebug: {},
  itemWrapperWarn: {
    backgroundColor: '#FFFACD',
    borderColor: '#FFB930',
  },
  itemLabelLog: {},
  itemLabelClear: {
    fontSize: 12,
    color: '#868686',
    fontStyle: 'italic',
  },
  itemLabelInfo: {
    color: '#6A5ACD',
  },
  itemLabelDebug: {
    color: '#DAA520',
  },
  itemLabelWarn: {
    color: '#FFA500',
  },
})

export default Item
