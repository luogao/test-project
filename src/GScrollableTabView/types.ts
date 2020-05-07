import { ReactElement } from "react"
import { ViewStyle, StyleProp, TextStyle } from "react-native"
import Animated from "react-native-reanimated"

export enum TabBarPosition {
  top = 'top',
  bottom = 'bottom',
  overlayTop = 'overlayTop',
  overlayBottom = 'overlayBottom',
}

export type Props = {
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
  parentAnimationValue?: Animated.Value<number>
}

export type State = {
  sceneKeys: any[]
  currentPage: number
  containerWidth: number
}

export type TabBarProps = {
  goToPage: (page: number) => void
  tabs: any
  activeTab: number
  scrollValue: Animated.Node<number>
  containerWidth: number
  backgroundColor?: string
  activeTextColor?: string
  inactiveTextColor?: string
  textStyle?: StyleProp<TextStyle>
  underlineStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}