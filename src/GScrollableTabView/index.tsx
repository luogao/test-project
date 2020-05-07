// import React, { PureComponent, ReactElement, ReactNode } from 'react'
// import {
//   Dimensions,
//   View,
//   Animated,
//   ScrollView,
//   Platform,
//   StyleSheet,
//   InteractionManager,
//   StyleProp,
//   ViewStyle,
//   TextStyle,
// } from 'react-native'
// import ViewPager from '@react-native-community/viewpager'
// import SceneComponent from './SceneComponent'
// // import DefaultTabBar from './DefaultTabBar'
// import ReAnimated from 'react-native-reanimated'
// import ScrollableContent from './ScrollableContent'
import GScrollableTabViewIos from './GScrollableTabViewIos'
import { Platform } from 'react-native'
import GScrollableTabViewAndroid from './GScrollableTabViewAndroid'
// import GScrollableTabViewAndroid from './GScrollableTabViewAndroid'

// enum TabBarPosition {
//   top = 'top',
//   bottom = 'bottom',
//   overlayTop = 'overlayTop',
//   overlayBottom = 'overlayBottom',
// }

// type Props = {
//   tabBarPosition: TabBarPosition
//   initialPage?: number
//   page?: number
//   onChangeTab?: ({ }: any) => void
//   onScroll?: (number) => void
//   renderTabBar?: (props: any) => ReactElement
//   tabBarUnderlineStyle?: StyleProp<ViewStyle>
//   tabBarBackgroundColor?: string
//   tabBarActiveTextColor?: string
//   tabBarInactiveTextColor?: string
//   tabBarTextStyle?: StyleProp<TextStyle>
//   style?: StyleProp<ViewStyle>
//   contentProps?: any
//   scrollWithoutAnimation?: boolean
//   locked?: boolean
//   prerenderingSiblingsNumber?: number
//   parentAnimationValue?: ReAnimated.Value<number>
// }
// type State = {
//   sceneKeys: any[]
//   currentPage: number
//   containerWidth: number
//   scrollValue: Animated.Value
//   scrollXIOS: Animated.Value
//   reScrollValue: ReAnimated.Node<number>
//   reScrollXIOS: ReAnimated.Value<number>
// }

// export type TabBarProps = {
//   goToPage: (page: number) => void
//   tabs: any
//   activeTab: number
//   scrollValue: ReAnimated.Node<number>
//   containerWidth: number
//   backgroundColor?: string
//   activeTextColor?: string
//   inactiveTextColor?: string
//   textStyle?: StyleProp<TextStyle>
//   underlineStyle?: StyleProp<ViewStyle>
//   style?: StyleProp<ViewStyle>
// }

// const AnimatedViewPagerAndroid =
//   Platform.OS === 'android' ? Animated.createAnimatedComponent(ViewPager) : undefined

// const DEFAULT_CONTAINER_WIDTH = Dimensions.get('window').width

// class GScrollableTabView extends PureComponent<Props, State> {
//   static defaultProps = {
//     tabBarPosition: 'top',
//     initialPage: 0,
//     page: -1,
//     onChangeTab: () => { },
//     onScroll: () => { },
//     contentProps: {},
//     scrollWithoutAnimation: false,
//     locked: false,
//     prerenderingSiblingsNumber: 0,
//   }

//   scrollOnMountCalled: boolean = false
//   scrollView = React.createRef<ScrollView | ViewPager>()

//   constructor (props: Props) {
//     super(props)
//     this.state = this.getInitialState()
//   }

//   componentDidUpdate (prevProps) {
//     if (this.props.children !== prevProps.children) {
//       this.updateSceneKeys({ page: this.state.currentPage, children: this.props.children })
//     }

//     if (this.props.page >= 0 && this.props.page !== this.state.currentPage) {
//       this.goToPage(this.props.page)
//     }
//   }

//   componentWillUnmount () { }

//   reScrollXIOS: ReAnimated.Value<number> = new ReAnimated.Value(
//     this.props.initialPage * DEFAULT_CONTAINER_WIDTH
//   )

//   containerWidthAnimatedValue = new ReAnimated.Value(DEFAULT_CONTAINER_WIDTH)

//   reScrollValue = ReAnimated.divide(this.reScrollXIOS, this.containerWidthAnimatedValue)

//   // 生成key值
//   private _makeSceneKey = (child, idx) => {
//     return child.props.tabLabel + '_' + idx
//   }

//   // 遍历 this.porps.children
//   private _children = (children = this.props.children) => {
//     return React.Children.map(children, (child) => child)
//   }

//   // 判断是否存在key
//   private _keyExists = (sceneKeys, key) => {
//     return sceneKeys.find((sceneKey) => key === sceneKey)
//   }

//   // 根据传入的scene id 和当前的id 以及this.props.prerenderingSiblingsNumber 来决定是否需要渲染
//   private _shouldRenderSceneKey = (idx, currentPageKey) => {
//     let numOfSibling = this.props.prerenderingSiblingsNumber
//     return idx < currentPageKey + numOfSibling + 1 && idx > currentPageKey - numOfSibling - 1
//   }

//   // 返回应该渲染的子元素， 根据this.props.prerenderingSiblingsNumber 和已经渲染的scene 来决定返回的内容
//   private _composeScenes = () => {
//     return this._children().map((child, idx) => {
//       let key = this._makeSceneKey(child, idx)
//       return (
//         <SceneComponent
//           key={ (child as ReactElement).key }
//           shouldUpdated={ this._shouldRenderSceneKey(idx, this.state.currentPage) }
//           style={ { width: this.state.containerWidth } }
//         >
//           { this._keyExists(this.state.sceneKeys, key) ? (
//             child
//           ) : (
//               <View tabLabel={ (child as ReactElement).props.tabLabel } />
//             ) }
//         </SceneComponent>
//       )
//     })
//   }

//   private _onMomentumScrollBeginAndEnd = (e) => {
//     const offsetX = e.nativeEvent.contentOffset.x
//     const page = Math.round(offsetX / this.state.containerWidth)
//     if (this.state.currentPage !== page) {
//       this._updateSelectedPage(page)
//     }
//   }

//   // 安卓端 pageView 跳转指定page
//   // iOS端 处理scrollview 滑动到位置
//   private _updateSelectedPage = (nextPage) => {
//     let localNextPage = nextPage
//     if (typeof localNextPage === 'object') {
//       localNextPage = nextPage.nativeEvent.position
//     }

//     const currentPage = this.state.currentPage
//     this.updateSceneKeys({
//       page: localNextPage,
//       callback: this._onChangeTab.bind(this, currentPage, localNextPage),
//     })
//   }

//   // 当前页面更改时 触发 onChangeTab
//   private _onChangeTab = (prevPage, currentPage) => {
//     this.props.onChangeTab({
//       i: currentPage,
//       ref: this._children()[ currentPage ],
//       from: prevPage,
//     })
//   }

//   private _onScroll = (e) => {
//     if (Platform.OS === 'ios') {
//       const offsetX = e.nativeEvent.contentOffset.x
//       if (offsetX === 0 && !this.scrollOnMountCalled) {
//         this.scrollOnMountCalled = true
//       } else {
//         this.props.onScroll(offsetX / this.state.containerWidth)
//       }
//     } else {
//       const { position, offset } = e.nativeEvent
//       this.props.onScroll(position + offset)
//     }
//   }

//   private _handleLayout = (e) => {
//     const { width } = e.nativeEvent.layout

//     if (!width || width <= 0 || Math.round(width) === Math.round(this.state.containerWidth)) {
//       console.log('??? ? ? ? ??? ? ? _handleLayout')
//       return
//     }

//     this.setState({ containerWidth: width })
//     this.containerWidthAnimatedValue.setValue(width)

//     requestAnimationFrame(() => {
//       this.goToPage(this.state.currentPage)
//     })
//   }

//   private getInitialState = () => {
//     const containerWidth = Dimensions.get('window').width
//     let scrollValue
//     let scrollXIOS
//     let positionAndroid
//     let offsetAndroid
//     let reScrollXIOS
//     let reScrollValue

//     if (Platform.OS === 'ios') {
//       scrollXIOS = new Animated.Value(this.props.initialPage * containerWidth) // 初始的滑动距离

//       reScrollXIOS = new ReAnimated.Value(this.props.initialPage * containerWidth) // reanimated 初始的滑动距离

//       const containerWidthAnimatedValue = new Animated.Value(containerWidth)
//       const reContainerWidthAnimatedValue = new Animated.Value(containerWidth)
//       // Need to call __makeNative manually to avoid a native animated bug. See
//       // https://github.com/facebook/react-native/pull/14435
//       containerWidthAnimatedValue.__makeNative()
//       scrollValue = Animated.divide(scrollXIOS, containerWidthAnimatedValue)

//       reScrollValue = ReAnimated.divide(reScrollXIOS, reContainerWidthAnimatedValue)

//       const callListeners = this._polyfillAnimatedValue(scrollValue)
//       scrollXIOS.addListener(({ value }) => callListeners(value / this.state.containerWidth))
//     } else {
//       positionAndroid = new Animated.Value(this.props.initialPage)
//       offsetAndroid = new Animated.Value(0)
//       scrollValue = Animated.add(positionAndroid, offsetAndroid)

//       const callListeners = this._polyfillAnimatedValue(scrollValue)
//       let positionAndroidValue = this.props.initialPage
//       let offsetAndroidValue = 0
//       positionAndroid.addListener(({ value }) => {
//         positionAndroidValue = value
//         callListeners(positionAndroidValue + offsetAndroidValue)
//       })
//       offsetAndroid.addListener(({ value }) => {
//         offsetAndroidValue = value
//         callListeners(positionAndroidValue + offsetAndroidValue)
//       })
//     }

//     return {
//       currentPage: this.props.initialPage,
//       scrollValue,
//       scrollXIOS,
//       reScrollValue,
//       reScrollXIOS,
//       positionAndroid,
//       offsetAndroid,
//       containerWidth,
//       sceneKeys: this.newSceneKeys({ currentPage: this.props.initialPage }),
//     }
//   }

//   _polyfillAnimatedValue = (animatedValue) => {
//     const listeners = new Set()
//     const addListener = (listener) => {
//       listeners.add(listener)
//     }

//     const removeListener = (listener) => {
//       listeners.delete(listener)
//     }

//     const removeAllListeners = () => {
//       listeners.clear()
//     }

//     animatedValue.addListener = addListener
//     animatedValue.removeListener = removeListener
//     animatedValue.removeAllListeners = removeAllListeners

//     return (value) => listeners.forEach((listener: any) => listener({ value }))
//   }

//   // 渲染tabbar
//   renderTabBar = (props) => {
//     if (!this.props.renderTabBar) {
//       return null
//     } else if (this.props.renderTabBar) {
//       return React.cloneElement(this.props.renderTabBar(props), props)
//     } else {
//       // TODO: 渲染默认的tabBar
//       return null
//     }
//   }

//   // 更新保存的key 值、currentPage
//   updateSceneKeys = ({ page, children = this.props.children, callback = () => { } }) => {
//     let newKeys = this.newSceneKeys({
//       previousKeys: this.state.sceneKeys,
//       currentPage: page,
//       children,
//     })
//     this.setState({ currentPage: page, sceneKeys: newKeys }, callback)
//   }

//   // 获取需要渲染的scene 的keys
//   newSceneKeys = ({ previousKeys = [], currentPage = 0, children = this.props.children }) => {
//     let newKeys = []
//     this._children(children).forEach((child, idx) => {
//       let key = this._makeSceneKey(child, idx)
//       if (this._keyExists(previousKeys, key) || this._shouldRenderSceneKey(idx, currentPage)) {
//         newKeys.push(key)
//       }
//     })
//     return newKeys
//   }

//   /**
//    * @description 滚动到指定的page
//    * pageNumber 页面的索引值
//    */
//   goToPage = (pageNumber) => {
//     if (Platform.OS === 'ios') {
//       const offset = pageNumber * this.state.containerWidth
//       if (this.scrollView) {
//         ; (this.scrollView.current._component as ScrollView).scrollTo({
//           x: offset,
//           y: 0,
//           animated: !this.props.scrollWithoutAnimation,
//         })
//       }
//     } else {
//       if (this.scrollView) {
//         if (this.props.scrollWithoutAnimation) {
//           ; (this.scrollView.current as ViewPager).setPageWithoutAnimation(pageNumber)
//         } else {
//           ; (this.scrollView.current as ViewPager).setPage(pageNumber)
//         }
//       }
//     }

//     const currentPage = this.state.currentPage
//     this.updateSceneKeys({
//       page: pageNumber,
//       callback: this._onChangeTab.bind(this, currentPage, pageNumber),
//     })
//   }

//   renderScrollableContent = () => {
//     if (Platform.OS === 'ios') {
//       const scenes = this._composeScenes()
//       return (
//         <ScrollableContent
//           containerWidth={ this.state.containerWidth }
//           initialPage={ this.props.initialPage }
//           currentPage={ this.state.currentPage }
//           locked={ this.props.locked }
//           onRef={ this.scrollView }
//           onSelectedPage={ this._updateSelectedPage }
//           onScroll={ this.props.onScroll }
//           scrollXIOS={ this.reScrollXIOS }
//           { ...this.props.contentProps }
//         >
//           { scenes }
//         </ScrollableContent>
//       )
//     } else {
//       const scenes = this._composeScenes()
//       return (
//         <AnimatedViewPagerAndroid
//           key={ this._children().length }
//           style={ styles.scrollableContentAndroid }
//           initialPage={ this.props.initialPage }
//           onPageSelected={ this._updateSelectedPage }
//           keyboardDismissMode='on-drag'
//           scrollEnabled={ !this.props.locked }
//           onPageScroll={ Animated.event(
//             [
//               {
//                 nativeEvent: {
//                   position: this.state.positionAndroid,
//                   offset: this.state.offsetAndroid,
//                 },
//               },
//             ],
//             {
//               useNativeDriver: true,
//               listener: this._onScroll,
//             }
//           ) }
//           ref={ this.scrollView }
//           { ...this.props.contentProps }
//         >
//           { scenes }
//         </AnimatedViewPagerAndroid>
//       )
//     }
//   }

//   render () {
//     console.log('render render render render render render')
//     const overlayTabs =
//       this.props.tabBarPosition === 'overlayTop' || this.props.tabBarPosition === 'overlayBottom'
//     const tabBarProps: TabBarProps = {
//       goToPage: this.goToPage,
//       tabs: this._children().map((child: ReactElement) => child.props.tabLabel),
//       activeTab: this.state.currentPage,
//       scrollValue: this.reScrollValue,
//       containerWidth: this.state.containerWidth,
//     }

//     if (this.props.tabBarBackgroundColor) {
//       tabBarProps.backgroundColor = this.props.tabBarBackgroundColor
//     }
//     if (this.props.tabBarActiveTextColor) {
//       tabBarProps.activeTextColor = this.props.tabBarActiveTextColor
//     }
//     if (this.props.tabBarInactiveTextColor) {
//       tabBarProps.inactiveTextColor = this.props.tabBarInactiveTextColor
//     }
//     if (this.props.tabBarTextStyle) {
//       tabBarProps.textStyle = this.props.tabBarTextStyle
//     }
//     if (this.props.tabBarUnderlineStyle) {
//       tabBarProps.underlineStyle = this.props.tabBarUnderlineStyle
//     }
//     if (overlayTabs) {
//       tabBarProps.style = {
//         position: 'absolute',
//         left: 0,
//         right: 0,
//         [ this.props.tabBarPosition === 'overlayTop' ? 'top' : 'bottom' ]: 0,
//       }
//     }
//     return (
//       <View style={ [ styles.container, this.props.style ] } onLayout={ this._handleLayout }>
//         { this.props.tabBarPosition === 'top' && this.renderTabBar(tabBarProps) }
//         { this.renderScrollableContent() }
//         { (this.props.tabBarPosition === 'bottom' || overlayTabs) && this.renderTabBar(tabBarProps) }
//         <ReAnimated.Code
//           exec={
//             ReAnimated.block([
//               ReAnimated.cond(
//                 ReAnimated.defined(this.props.parentAnimationValue),
//                 [ ReAnimated.set(this.props.parentAnimationValue, this.reScrollValue) ]
//               ),
//             ])
//           }
//         />
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollableContentAndroid: {
//     flex: 1,
//   },
// })
// export default GScrollableTabViewIos
export default Platform.select({
  ios: GScrollableTabViewIos,
  android: GScrollableTabViewAndroid
})
