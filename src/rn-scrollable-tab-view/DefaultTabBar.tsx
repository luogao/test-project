import React, { ReactNode } from 'react'
import { StyleSheet, Text, View, Animated, ViewPropTypes, StyleProp, ViewStyle } from 'react-native'
const Button = require('./Button')

type Props = {
  goToPage: (page: number) => void
  activeTab: number
  tabs: string[]
  backgroundColor: string
  activeTextColor: string
  inactiveTextColor: string
  textStyle: string
  tabStyle: StyleProp<ViewStyle>
  renderTab: () => ReactNode
  underlineStyle: StyleProp<ViewStyle>
  containerWidth: number
  scrollValue: Animated.Value
  style: any
}

export default class DefaultTabBar extends React.PureComponent<Props> {
  static defaultProps = {
    activeTextColor: 'navy',
    inactiveTextColor: 'black',
    backgroundColor: null,
  }

  constructor(props: Props) {
    super(props)
    this.props.scrollValue.addListener(({ value }) => {
      console.log(value)
    })
  }

  renderTabOption = (name: string, page: number) => {}

  renderTab = (
    name: string,
    page: number,
    isTabActive: boolean,
    onPressHandler: (page: number) => void
  ) => {
    const { activeTextColor, inactiveTextColor, textStyle } = this.props
    const textColor = isTabActive ? activeTextColor : inactiveTextColor
    const fontWeight = isTabActive ? 'bold' : 'normal'

    return (
      <Button
        style={{ flex: 1 }}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits='button'
        onPress={() => onPressHandler(page)}
      >
        <View style={[styles.tab, this.props.tabStyle]}>
          <Text style={[{ color: textColor, fontWeight }, textStyle]}>{name}</Text>
        </View>
      </Button>
    )
  }

  render() {
    const containerWidth = this.props.containerWidth
    const numberOfTabs = this.props.tabs.length
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    }

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    })
    return (
      <View
        style={[styles.tabs, { backgroundColor: this.props.backgroundColor }, this.props.style]}
      >
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page
          const renderTab = this.props.renderTab || this.renderTab
          return renderTab(name, page, isTabActive, this.props.goToPage)
        })}
        <Animated.View
          style={[
            tabUnderlineStyle,
            {
              transform: [{ translateX }],
            },
            this.props.underlineStyle,
          ]}
        />
      </View>
    )
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
    zIndex: 999,
  },
})
