import React from 'react'
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native'

import FacebookTabBar from './FacebookTabBar'
import ScrollableTabView from './GScrollableTabView'
import Animated from 'react-native-reanimated'
const animationValue = new Animated.Value(0)

const getScaleValue = (index: number) => {
  let arr = new Array(10)
  arr.fill(1)
  arr[index] = 2
  const output = arr.fill(1).reduce(
    (pre, cur, idx) => {
      if (idx === index) {
        pre.inputRange.push(idx)
        pre.outputRange.push(1)
      } else {
        pre.inputRange.push(idx)
        pre.outputRange.push(0.9) // 0.55 ≈ 14/26
      }
      return pre
    },
    { inputRange: [], outputRange: [] }
  )
  return output
}

const getRadiusValue = (index: number) => {
  let arr = new Array(10)
  arr.fill(1)
  arr[index] = 2
  const output = arr.fill(1).reduce(
    (pre, cur, idx) => {
      if (idx === index) {
        pre.inputRange.push(idx)
        pre.outputRange.push(0)
      } else {
        pre.inputRange.push(idx)
        pre.outputRange.push(100) // 0.55 ≈ 14/26
      }
      return pre
    },
    { inputRange: [], outputRange: [] }
  )
  return output
}

export default () => {
  return (
    <ScrollableTabView
      style={{ marginTop: 100 }}
      initialPage={1}
      prerenderingSiblingsNumber={Infinity}
      renderTabBar={() => <FacebookTabBar />}
      parentAnimationValue={animationValue}
    >
      <ScrollView tabLabel='ios-paper' style={styles.tabView}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: Animated.interpolate(animationValue, getScaleValue(0)) }] },
            { borderRadius:  Animated.interpolate(animationValue, getRadiusValue(0)) },
          ]}
        >
          <Text>News</Text>
        </Animated.View>
      </ScrollView>
      <ScrollView tabLabel='ios-people' style={styles.tabView}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: Animated.interpolate(animationValue, getScaleValue(1)) }] },
            { borderRadius:  Animated.interpolate(animationValue, getRadiusValue(1)) },
          ]}
        >
          <Text>Friends</Text>
        </Animated.View>
      </ScrollView>
      <ScrollView tabLabel='ios-chatboxes' style={styles.tabView}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: Animated.interpolate(animationValue, getScaleValue(2)) }] },
            { borderRadius:  Animated.interpolate(animationValue, getRadiusValue(2)) },
          ]}
        >
          <Text>Messenger</Text>
        </Animated.View>
      </ScrollView>
      <ScrollView tabLabel='ios-notifications' style={styles.tabView}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: Animated.interpolate(animationValue, getScaleValue(3)) }] },
            { borderRadius:  Animated.interpolate(animationValue, getRadiusValue(3)) },
          ]}
        >
          <Text>Notifications</Text>
        </Animated.View>
      </ScrollView>
      <ScrollView tabLabel='ios-list' style={styles.tabView}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: Animated.interpolate(animationValue, getScaleValue(4)) }] },
            { borderRadius:  Animated.interpolate(animationValue, getRadiusValue(4)) },
          ]}
        >
          <Text>Other nav</Text>
        </Animated.View>
      </ScrollView>
    </ScrollableTabView>
  )
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: 'pink',
    borderColor: 'rgba(0,0,0,0.1)',
    height: 600,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
})
