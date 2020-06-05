import React, { ReactElement, ReactNode } from "react"
import { ViewStyle, StyleProp, TextStyle, Animated } from "react-native"

export enum TabBarPosition {
  top = 'top',
  bottom = 'bottom',
  overlayTop = 'overlayTop',
  overlayBottom = 'overlayBottom',
}

export interface Props {
  tabBarPosition: TabBarPosition
  initialPage?: number
  page?: number
  onChangeTab?: ({ }: any) => void
  onScroll?: (value: number) => void
  renderTabBar?: (props: any) => ReactElement
  tabBarUnderlineStyle?: StyleProp<ViewStyle>
  tabBarBackgroundColor?: string
  tabBarActiveTextColor?: string
  tabBarInactiveTextColor?: string
  tabBarTextStyle?: StyleProp<TextStyle>
  style?: StyleProp<ViewStyle>
  contentProps?: any
  scrollWithoutAnimation?: boolean
  locked?: boolean
  prerenderingSiblingsNumber?: number
  parentAnimationValue?: Animated.Value
  onChangeDebounce?: number
}

export type State = {
  sceneKeys: string[]
  currentPage: number
  containerWidth: number
}

export type TabBarProps = {
  goToPage: (page: number) => void
  tabs: any
  activeTab: number
  scrollValue: Animated.Value
  containerWidth: number
  backgroundColor?: string
  activeTextColor?: string
  inactiveTextColor?: string
  textStyle?: StyleProp<TextStyle>
  underlineStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}