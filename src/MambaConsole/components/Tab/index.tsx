import React, { Component, ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import Button from '../Button'

const TabbarHeight = 40

type TabItemType = {
  label: string
  render: () => ReactNode
}

type Props = {
  tabs: TabItemType[]
  activeTab: string
  onChange: (tab: string) => void
}

class index extends Component<Props> {
  handleItemPress = (tab: TabItemType) => {
    this.props.onChange(tab.label)
  }

  renderTabbarItem = (tab: TabItemType) => {
    const onItemPress = () => {
      this.handleItemPress(tab)
    }

    return (
      <Button
        activeOpacity={1}
        buttonStyle={
          this.props.activeTab === tab.label ? styles.tabbarItemActive : styles.tabbarItem
        }
        label={tab.label}
        key={tab.label}
        onPress={onItemPress}
      />
    )
  }

  renderTabItemContent = () => {
    const tab = this.props.tabs.find((_tab) => _tab.label === this.props.activeTab)
    return tab ? tab.render() : null
  }

  render() {
    return (
      <>
        <View style={styles.tabbar}>{this.props.tabs.map(this.renderTabbarItem)}</View>
        <View style={styles.tabContent}>{this.renderTabItemContent()}</View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  tabbar: {
    height: TabbarHeight,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    backgroundColor: '#eff0f4',
  },
  tabbarItem: {
    backgroundColor: '#eff0f4',
    borderColor: '#dedfe0',
    paddingHorizontal: 20,
    borderRightWidth: 1,
  },
  tabbarItemActive: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderColor: '#dedfe0',
    borderRightWidth: 1,
  },
  tabContent: {
    flex: 1,
  },
})

export default index
