import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Animated from 'react-native-reanimated'
import { interpolateColor } from 'react-native-redash'

class FacebookTabBar extends React.Component {
  icons = []

  constructor(props) {
    super(props)
    this.icons = []
  }

  componentDidMount() {}
  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (204 - 59) * progress
    const green = 89 + (204 - 89) * progress
    const blue = 152 + (204 - 152) * progress
    return `rgb(${red}, ${green}, ${blue})`
  }

  render() {
    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) => {
          return (
            <TabBarItem
              key={tab}
              tab={tab}
              index={i}
              activeTab={this.props.activeTab}
              goToPage={this.props.goToPage}
              scrollValue={this.props.scrollValue}
            />
          )
        })}
      </View>
    )
  }
}

class TabBarItem extends React.Component {
  handlePress = () => {
    this.props.goToPage(this.props.index)
  }

  getScaleValue = (index: number) => {
    let arr = new Array(10)
    arr.fill(1)
    arr[index] = 2
    const output = arr.fill(1).reduce(
      (pre, cur, idx) => {
        if (idx === index) {
          pre.inputRange.push(idx)
          pre.outputRange.push(1.3)
        } else {
          pre.inputRange.push(idx)
          pre.outputRange.push(1) // 0.55 ≈ 14/26
        }
        return pre
      },
      { inputRange: [], outputRange: [] }
    )
    return output
  }

  getColorValue = (index: number) => {
    let arr = new Array(10)
    arr.fill(1)
    arr[index] = 2
    const output = arr.fill(1).reduce(
      (pre, cur, idx) => {
        if (idx === index) {
          pre.inputRange.push(idx)
          pre.outputRange.push('rgb(59,89,152)')
        } else {
          pre.inputRange.push(idx)
          pre.outputRange.push('rgb(204,204,204)')
        }
        return pre
      },
      { inputRange: [], outputRange: [] }
    )
    return output
  }

  render() {
    const { tab, goToPage, activeTab, index, scrollValue } = this.props
    const scale = Animated.interpolate(scrollValue, this.getScaleValue(index))
    const color = interpolateColor(scrollValue, this.getColorValue(index), 'rgb')
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity activeOpacity={1} onPress={this.handlePress} style={styles.tab}>
          <Animated.Text style={{color}}>{tab}</Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }
  shouldComponentUpdate() {
    return false
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
})

export default FacebookTabBar
