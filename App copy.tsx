import React from 'react'
import { FlatList, Platform, StyleSheet, Text, View, YellowBox } from 'react-native'
import { RectButton, ScrollView } from 'react-native-gesture-handler'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import ChatHeads from './src/ReAnimatedExample/chatHeads'
import Code from './src/ReAnimatedExample/code'
import Colors from './src/ReAnimatedExample/colors'
import DifferentSpringConfigs from './src/ReAnimatedExample/differentSpringConfigs'
import ImageViewer from './src/ReAnimatedExample/imageViewer'
import Imperative from './src/ReAnimatedExample/imperative'
import InteractablePlayground, { SCREENS as INTERACTABLE_SCREENS } from './src/ReAnimatedExample/interactablePlayground'
import PanRotateAndZoom from './src/ReAnimatedExample/PanRotateAndZoom'
import ProgressBar from './src/ReAnimatedExample/progressBar'
import Rotations from './src/ReAnimatedExample/rotations'
import Snappable from './src/ReAnimatedExample/snappable'
import Interpolate from './src/ReAnimatedExample/src/interpolate'
import StartAPI from './src/ReAnimatedExample/startAPI'
import Test from './src/ReAnimatedExample/test'
import TransitionsProgress from './src/ReAnimatedExample/transitions/progress'
import TransitionsSequence from './src/ReAnimatedExample/transitions/sequence'
import TransitionsShuffle from './src/ReAnimatedExample/transitions/shuffle'
import TransitionsTicket from './src/ReAnimatedExample/transitions/ticket'
import WidthAndHeight from './src/ReAnimatedExample/widthAndHeight'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'])
// refers to bug in React Navigation which should be fixed soon
// https://github.com/react-navigation/react-navigation/issues/3956

const SCREENS = {
  Snappable: { screen: Snappable, title: 'Snappable' },
  Test: { screen: Test, title: 'Test' },
  ImageViewer: { screen: ImageViewer, title: 'Image Viewer' },
  Interactable: { screen: InteractablePlayground, title: 'Interactable' },
  Interpolate: { screen: Interpolate, title: 'Interpolate' },
  Colors: { screen: Colors, title: 'Colors' },
  StartAPI: { screen: StartAPI, title: 'Start API' },
  chatHeads: { screen: ChatHeads, title: 'Chat heads (iOS only)' },
  code: { screen: Code, title: 'Animated.Code component' },
  width: { screen: WidthAndHeight, title: 'width & height & more' },
  rotations: { screen: Rotations, title: 'rotations (concat node)' },
  imperative: {
    screen: Imperative,
    title: 'imperative (set value / toggle visibility)',
  },
  panRotateAndZoom: {
    screen: PanRotateAndZoom,
    title: 'Pan, rotate and zoom (via native event function)',
  },
  progressBar: {
    screen: ProgressBar,
    title: 'Progress bar',
  },
  differentSpringConfigs: {
    screen: DifferentSpringConfigs,
    title: 'Different Spring Configs',
  },
  transitionsSequence: {
    screen: TransitionsSequence,
    title: 'Transitions sequence',
  },
  transitionsShuffle: {
    screen: TransitionsShuffle,
    title: 'Transitions shuffle',
  },
  transitionsProgress: {
    screen: TransitionsProgress,
    title: 'Transitions progress bar',
  },
  transitionsTicket: {
    screen: TransitionsTicket,
    title: 'Transitions – flight ticket demo',
  },
}

class MainScreen extends React.Component {
  static navigationOptions = {
    title: '🎬 Reanimated Examples',
  }

  render() {
    const data = Object.keys(SCREENS).map((key) => ({ key }))
    return (
      <FlatList
        style={styles.list}
        data={data}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={(props) => (
          <MainScreenItem
            {...props}
            onPressItem={({ key }) => this.props.navigation.navigate(key)}
          />
        )}
        renderScrollComponent={(props) => <ScrollView {...props} />}
      />
    )
  }
}

const ItemSeparator = () => <View style={styles.separator} />

class MainScreenItem extends React.Component {
  _onPress = () => this.props.onPressItem(this.props.item)
  render() {
    const { key } = this.props.item
    return (
      <RectButton style={styles.button} onPress={this._onPress}>
        <Text style={styles.buttonText}>{SCREENS[key].title || key}</Text>
      </RectButton>
    )
  }
}

const ExampleApp = createStackNavigator(
  {
    Main: { screen: MainScreen },
    ...SCREENS,
    ...INTERACTABLE_SCREENS,
  },
  {
    initialRouteName: 'Main',
    headerMode: 'screen',
  }
)

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#EFEFF4',
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBE0',
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})

const createApp = Platform.select({
  default: (input) => createAppContainer(input),
})

export default createApp(ExampleApp)
