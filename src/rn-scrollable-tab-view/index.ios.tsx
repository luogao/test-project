import React, { Component, ReactNode } from 'react'
import {
  View,
  StyleSheet,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  ScrollView,
} from 'react-native'
import _ from 'lodash'
import { Props, State, TabBarProps } from './types'
import { DEFAULT_CONTAINER_WIDTH, DEFAULT_ON_CHANGE_DEBOUNCE } from './constants'

import SceneComponent from './SceneComponent'
import {
  _polyfillAnimatedValue,
  newSceneKeys,
  _makeSceneKey,
  _keyExists,
  _shouldRenderSceneKey,
  getChildren,
} from './shared'
// import Animated, { call } from 'react-native-reanimated'

import DefaultTabBar from './DefaultTabBar'

interface AnimatedScrollView extends ScrollView {
  getNode: () => ScrollView
}

export default class ScrollableTabView extends Component<Props, State> {
  static defaultProps = {
    tabBarPosition: 'top',
    initialPage: 0,
    page: -1,
    onChangeTab: () => {},
    onScroll: () => {},
    contentProps: {},
    scrollWithoutAnimation: false,
    locked: false,
    prerenderingSiblingsNumber: 0,
  }

  private scrollView: null | AnimatedScrollView = null
  private scrollValue: Animated.Value | Animated.AnimatedAddition = new Animated.Value(0)
  private scrollXIOS: Animated.Value = new Animated.Value(0)
  private offsetAndroid: Animated.Value = new Animated.Value(0)
  private positionAndroid: Animated.Value = new Animated.Value(this.props.initialPage || 0)
  private containerWidthAnimationValue: Animated.Value = new Animated.Value(DEFAULT_CONTAINER_WIDTH)
  private containerWidth = DEFAULT_CONTAINER_WIDTH
  private initOffsetX = { x: this.props.initialPage * this.containerWidth }
  private tempPage = this.props.initialPage
  private childrenLabels = []
  private sceneKeys = []

  constructor(props: Props) {
    super(props)
    this.state = this.getInitialState()
    this._updateSelectedPage = _.debounce(
      this._updateSelectedPage,
      this.props.onChangeDebounce || DEFAULT_ON_CHANGE_DEBOUNCE
    )
    this.setChildrenLabels()
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    if (props.page && props.page >= 0 && props.page !== this.state.currentPage) {
      console.log('componentWillReceiveProps🌟')
      this.goToPage(props.page)
    }
    this.setChildrenLabels()
  }

  componentWillUnmount() {
    this.positionAndroid.removeAllListeners()
    this.offsetAndroid.removeAllListeners()
  }

  private _onChangeTab = (prevPage: number, currentPage: number) => {
    console.log('? ? ? ?!!! _onChangeTab')
    this.props.onChangeTab &&
      this.props.onChangeTab({
        i: currentPage,
        ref: getChildren(this.props.children)[currentPage],
        from: prevPage,
      })
  }

  private setSceneKeys = (sceneKeys: string[]) => {
    this.sceneKeys = sceneKeys
  }

  private updateSceneKeys = ({
    page,
    children = this.props.children,
    callback = () => {},
    from,
  }: {
    page: number
    children?: ReactNode
    callback?: () => void
    from: string
  }) => {
    console.log('why updateSceneKeys🕵️‍♂️🕵️‍♂️🕵️‍♂️🕵️‍♂️🕵️‍♂️', from)
    let newKeys = newSceneKeys({
      previousKeys: this.sceneKeys,
      currentPage: page,
      children,
      prerenderingSiblingsNumber: this.props.prerenderingSiblingsNumber,
    })
    this.setSceneKeys(newKeys)
    this.setState({ currentPage: page }, callback)
  }

  private getInitialState = () => {
    this.scrollXIOS = new Animated.Value(this.props.initialPage * this.containerWidth)
    // Need to call __makeNative manually to avoid a native animated bug. See
    // https://github.com/facebook/react-native/pull/14435
    // @ts-ignore
    // this.containerWidthAnimationValue.__makeNative()
    this.scrollValue = Animated.divide(this.scrollXIOS, this.containerWidthAnimationValue)
    const callListeners = _polyfillAnimatedValue(this.scrollValue)
    this.scrollXIOS.addListener(({ value }) => callListeners(value / this.containerWidth))
    this.setSceneKeys(
      newSceneKeys({
        currentPage: this.props.initialPage,
        children: this.props.children,
        prerenderingSiblingsNumber: this.props.prerenderingSiblingsNumber,
      })
    )

    return {
      currentPage: this.props.initialPage,
    }
  }

  private goToPage = (pageNumber: number) => {
    if (this.scrollView) {
      const offset = pageNumber * this.containerWidth
      if (this.scrollView) {
        this.scrollView
          .getNode()
          .scrollTo({ x: offset, y: 0, animated: !this.props.scrollWithoutAnimation })
      }
    }

    const currentPage = this.state.currentPage
    this.updateSceneKeys({
      page: pageNumber,
      callback: this._onChangeTab.bind(this, currentPage, pageNumber),
      from: 'goToPage',
    })
  }

  private _onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log('_onScroll ? ? ?? ? ? ? ? ? ? ? ? ?')
    const {
      contentOffset: { x },
    } = e.nativeEvent
    this.props.onScroll && this.props.onScroll(x / this.containerWidth)
  }

  private _handleLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout
    if (!width || width <= 0 || Math.round(width) === Math.round(this.containerWidth)) {
      return
    }
    this.setContainerWidth(width)
    requestAnimationFrame(() => {
      this.goToPage(this.state.currentPage)
    })
  }

  private setContainerWidth = (value: number) => {
    this.containerWidth = value
    this.containerWidthAnimationValue.setValue(value)
  }

  private _updateSelectedPage = (nextPage: number) => {
    console.log('_updateSelectedPage ???? ?', nextPage)
    let localNextPage = nextPage
    if (this.state.currentPage !== nextPage) {
      const currentPage = this.state.currentPage
      this.updateSceneKeys({
        page: localNextPage,
        callback: this._onChangeTab.bind(this, currentPage, localNextPage),
        from: '_updateSelectedPage',
      })
    }
  }

  private getChildrenLabels = () => {
    if (
      this.childrenLabels.length > 0 &&
      this.childrenLabels.length === getChildren(this.props.children).length
    ) {
      return this.childrenLabels
    } else {
      return this.setChildrenLabels()
    }
  }

  private setChildrenLabels = () => {
    return (this.childrenLabels = getChildren(this.props.children).map(
      (child: ReactNode) => child.props.tabLabel
    ))
  }

  private onScrollViewRef = (ref: AnimatedScrollView) => (this.scrollView = ref)

  private handlePageScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: this.scrollXIOS } } }],
    {
      useNativeDriver: true,
      listener: this._onScroll,
    }
  )

  private renderScrollableContent = () => {
    console.log('renderScrollableContent ??~~~~~~~~~~~~~')
    const scenes = this._composeScenes()
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        automaticallyAdjustContentInsets={false}
        contentOffset={this.initOffsetX}
        ref={this.onScrollViewRef}
        onScroll={this.handlePageScroll}
        onMomentumScrollBegin={this.handleMomentumScrollBeginAndEnd}
        onMomentumScrollEnd={this.handleMomentumScrollBeginAndEnd}
        scrollEventThrottle={16}
        scrollsToTop={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!this.props.locked}
        directionalLockEnabled
        alwaysBounceVertical={false}
        keyboardDismissMode='on-drag'
        {...this.props.contentProps}
      >
        {scenes}
      </Animated.ScrollView>
    )
  }

  handleMomentumScrollBeginAndEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    e.persist()
    this._onMomentumScrollBeginAndEnd(e)
  }

  _onMomentumScrollBeginAndEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x
    const page = Math.round(offsetX / this.containerWidth)
    if (this.tempPage !== page) {
      this.tempPage = page
      this._updateSelectedPage(page)
    }
  }

  _composeScenes = () => {
    return getChildren(this.props.children).map((child: ReactNode, idx: number) => {
      let key = _makeSceneKey(child, idx)
      return (
        <SceneComponent
          key={child.key}
          shouldUpdate={_shouldRenderSceneKey(
            idx,
            this.state.currentPage,
            this.props.prerenderingSiblingsNumber
          )}
          containerWidth={this.containerWidthAnimationValue}
        >
          {_keyExists(this.sceneKeys, key) ? child : <View tabLabel={child.props.tabLabel} />}
        </SceneComponent>
      )
    })
  }

  renderTabBar = (props: TabBarProps) => {
    if (!!this.props.renderTabBar === false) {
      return <DefaultTabBar {...props} />
    } else if (this.props.renderTabBar) {
      return React.cloneElement(this.props.renderTabBar(props), props)
    } else {
      return <DefaultTabBar {...props} />
    }
  }

  render() {
    console.log('render render render render render🔞🔞🔞🔞🔞')
    let overlayTabs =
      this.props.tabBarPosition === 'overlayTop' || this.props.tabBarPosition === 'overlayBottom'
    let tabBarProps: TabBarProps = {
      goToPage: this.goToPage,
      tabs: this.getChildrenLabels(),
      activeTab: this.state.currentPage,
      scrollValue: this.scrollValue as Animated.Value,
      containerWidth: this.containerWidth,
    }

    if (this.props.tabBarBackgroundColor) {
      tabBarProps.backgroundColor = this.props.tabBarBackgroundColor
    }
    if (this.props.tabBarActiveTextColor) {
      tabBarProps.activeTextColor = this.props.tabBarActiveTextColor
    }
    if (this.props.tabBarInactiveTextColor) {
      tabBarProps.inactiveTextColor = this.props.tabBarInactiveTextColor
    }
    if (this.props.tabBarTextStyle) {
      tabBarProps.textStyle = this.props.tabBarTextStyle
    }
    if (this.props.tabBarUnderlineStyle) {
      tabBarProps.underlineStyle = this.props.tabBarUnderlineStyle
    }
    if (overlayTabs) {
      tabBarProps.style = {
        position: 'absolute',
        left: 0,
        right: 0,
        [this.props.tabBarPosition === 'overlayTop' ? 'top' : 'bottom']: 0,
      }
    }

    return (
      <View style={[styles.container, this.props.style]} onLayout={this._handleLayout}>
        {this.props.tabBarPosition === 'top' && this.renderTabBar(tabBarProps)}
        {this.renderScrollableContent()}
        {(this.props.tabBarPosition === 'bottom' || overlayTabs) && this.renderTabBar(tabBarProps)}
        {/* <Animated.Code
          exec={Animated.block([
            call([this.positionAndroid, this.offsetAndroid], (value) => {
              console.log(value)
            }),
          ])}
        /> */}
      </View>
    )
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const _props =
      !_.isEqual(nextProps.contentProps, this.props.contentProps) ||
      !_.isEqual(nextProps.locked, this.props.locked) ||
      !_.isEqual(nextProps.page, this.props.page) ||
      !_.isEqual(nextProps.style, this.props.style) ||
      !_.isEqual(nextProps.scrollWithoutAnimation, this.props.scrollWithoutAnimation) ||
      !_.isEqual(nextProps.tabBarUnderlineStyle, this.props.tabBarUnderlineStyle) ||
      !_.isEqual(nextProps.tabBarActiveTextColor, this.props.tabBarActiveTextColor) ||
      !_.isEqual(nextProps.tabBarBackgroundColor, this.props.tabBarBackgroundColor) ||
      !_.isEqual(nextProps.tabBarInactiveTextColor, this.props.tabBarInactiveTextColor) ||
      !_.isEqual(nextProps.tabBarPosition, this.props.tabBarPosition) ||
      !_.isEqual(nextProps.tabBarTextStyle, this.props.tabBarTextStyle)
    const _state = !_.isEqual(nextState, this.state)
    console.log({ _props })
    console.log({ _state })
    return _props || _state
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollableContentAndroid: {
    flex: 1,
  },
})
