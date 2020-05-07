import React, { PureComponent, ReactElement } from 'react'
import {
  View,
  StyleSheet,
  ViewPagerAndroid,
} from 'react-native'
import SceneComponent from './SceneComponent'
// import DefaultTabBar from './DefaultTabBar'
import Animated from 'react-native-reanimated'
import { DEFAULT_CONTAINER_WIDTH } from './constants'
import { Props, State, TabBarProps } from './types'
import ViewPager from '@react-native-community/viewpager'


const AnimatedViewPagerAndroid = Animated.createAnimatedComponent(ViewPagerAndroid)

interface AnimatedViewPager extends ViewPagerAndroid {
  getNode: () => ViewPagerAndroid
}

class GScrollableTabViewAndroid extends PureComponent<Props, State> {
  static defaultProps = {
    tabBarPosition: 'top',
    initialPage: 0,
    page: -1,
    onChangeTab: () => { },
    onScroll: () => { },
    contentProps: {},
    scrollWithoutAnimation: false,
    locked: false,
    prerenderingSiblingsNumber: 0,
  }

  scrollOnMountCalled: boolean = false
  scrollView = React.createRef<AnimatedViewPager>()

  constructor (props: Props) {
    super(props)
    this.state = this.getInitialState()
  }

  componentDidUpdate (prevProps) {
    if (this.props.children !== prevProps.children) {
      this.updateSceneKeys({ page: this.state.currentPage, children: this.props.children })
    }

    if (this.props.page >= 0 && this.props.page !== this.state.currentPage) {
      this.goToPage(this.props.page)
    }
  }

  componentWillUnmount () { }

  containerWidthAnimatedValue = new Animated.Value(DEFAULT_CONTAINER_WIDTH)
  positionAndroid = new Animated.Value(this.props.initialPage)
  offsetAndroid = new Animated.Value(0)
  scrollValue = Animated.add(this.positionAndroid, this.offsetAndroid)

  // 生成key值
  private _makeSceneKey = (child, idx) => {
    return child.props.tabLabel + '_' + idx
  }

  // 遍历 this.porps.children
  private _children = (children = this.props.children) => {
    return React.Children.map(children, (child) => child)
  }

  // 判断是否存在key
  private _keyExists = (sceneKeys, key) => {
    return sceneKeys.find((sceneKey) => key === sceneKey)
  }

  // 根据传入的scene id 和当前的id 以及this.props.prerenderingSiblingsNumber 来决定是否需要渲染
  private _shouldRenderSceneKey = (idx, currentPageKey) => {
    let numOfSibling = this.props.prerenderingSiblingsNumber
    return idx < currentPageKey + numOfSibling + 1 && idx > currentPageKey - numOfSibling - 1
  }

  // 返回应该渲染的子元素， 根据this.props.prerenderingSiblingsNumber 和已经渲染的scene 来决定返回的内容
  private _composeScenes = () => {
    return this._children().map((child, idx) => {
      let key = this._makeSceneKey(child, idx)
      return (
        <SceneComponent
          key={ (child as ReactElement).key }
          shouldUpdated={ this._shouldRenderSceneKey(idx, this.state.currentPage) }
          style={ { width: this.state.containerWidth } }
        >
          {
            this._keyExists(this.state.sceneKeys, key) ?
              (child)
              :
              (<View tabLabel={ (child as ReactElement).props.tabLabel } />)
          }
        </SceneComponent>
      )
    })
  }


  // iOS端 处理scrollview 滑动到位置
  private _updateSelectedPage = (nextPage) => {
    let localNextPage = nextPage.nativeEvent.position
    const currentPage = this.state.currentPage
    this.updateSceneKeys({
      page: localNextPage,
      callback: this._onChangeTab.bind(this, currentPage, localNextPage),
    })
  }

  // 当前页面更改时 触发 onChangeTab
  private _onChangeTab = (prevPage, currentPage) => {
    this.props.onChangeTab && this.props.onChangeTab({
      i: currentPage,
      ref: this._children()[ currentPage ],
      from: prevPage,
    })
  }

  // private _onScroll = (e) => {
  //   if (Platform.OS === 'ios') {
  //     const offsetX = e.nativeEvent.contentOffset.x
  //     if (offsetX === 0 && !this.scrollOnMountCalled) {
  //       this.scrollOnMountCalled = true
  //     } else {
  //       this.props.onScroll(offsetX / this.state.containerWidth)
  //     }
  //   } else {
  //     const { position, offset } = e.nativeEvent
  //     this.props.onScroll(position + offset)
  //   }
  // }

  private _handleLayout = (e) => {
    const { width } = e.nativeEvent.layout
    if (!width || width <= 0 || Math.round(width) === Math.round(this.state.containerWidth)) {
      console.log('??? ? ? ? ??? ? ? _handleLayout')
      return
    }

    this.setState({ containerWidth: width })
    this.containerWidthAnimatedValue.setValue(width)

    requestAnimationFrame(() => {
      this.goToPage(this.state.currentPage)
    })
  }

  private getInitialState = () => {
    return {
      currentPage: this.props.initialPage || 0,
      containerWidth: DEFAULT_CONTAINER_WIDTH,
      sceneKeys: this.newSceneKeys({ currentPage: this.props.initialPage }),
    }
  }

  // 渲染tabbar
  renderTabBar = (props) => {
    if (!this.props.renderTabBar) {
      return null
    } else if (this.props.renderTabBar) {
      return React.cloneElement(this.props.renderTabBar(props), props)
    } else {
      // TODO: 渲染默认的tabBar
      return null
    }
  }

  // 更新保存的key 值、currentPage
  updateSceneKeys = ({ page, children = this.props.children, callback = () => { } }) => {
    let newKeys = this.newSceneKeys({
      previousKeys: this.state.sceneKeys,
      currentPage: page,
      children,
    })
    this.setState({ currentPage: page, sceneKeys: newKeys }, callback)
  }

  // 获取需要渲染的scene 的keys
  newSceneKeys = ({ previousKeys = [], currentPage = 0, children = this.props.children }) => {
    let newKeys = []
    this._children(children).forEach((child, idx) => {
      let key = this._makeSceneKey(child, idx)
      if (this._keyExists(previousKeys, key) || this._shouldRenderSceneKey(idx, currentPage)) {
        newKeys.push(key)
      }
    })
    return newKeys
  }

  /**
   * @description 滚动到指定的page
   * pageNumber 页面的索引值
   */
  goToPage = (pageNumber: number) => {
    if (this.scrollView) {
      console.log(this.scrollView.current)
      if (this.props.scrollWithoutAnimation) {
        ; (this.scrollView.current?.getNode() as ViewPager)?.setPageWithoutAnimation(pageNumber)
      } else {
        ; (this.scrollView.current?.getNode() as ViewPager)?.setPage(pageNumber)
      }
    }

    const currentPage = this.state.currentPage
    this.updateSceneKeys({
      page: pageNumber,
      callback: this._onChangeTab.bind(this, currentPage, pageNumber),
    })
  }

  renderScrollableContent = () => {
    const scenes = this._composeScenes()
    return (
      <AnimatedViewPagerAndroid
        key={ this._children().length }
        style={ styles.scrollableContentAndroid }
        initialPage={ this.props.initialPage }
        onPageSelected={ this._updateSelectedPage }
        keyboardDismissMode='on-drag'
        scrollEnabled={ !this.props.locked }
        onPageScroll={ Animated.event(
          [ {
            nativeEvent: {
              position: this.positionAndroid,
              offset: this.offsetAndroid,
            },
          }, ]
        ) }
        ref={ this.scrollView }
        { ...this.props.contentProps }
      >
        { scenes }
      </AnimatedViewPagerAndroid>
    )
  }

  render () {
    console.log('render render render render render render')
    const overlayTabs =
      this.props.tabBarPosition === 'overlayTop' || this.props.tabBarPosition === 'overlayBottom'
    const tabBarProps: TabBarProps = {
      goToPage: this.goToPage,
      tabs: this._children().map((child: ReactElement) => child.props.tabLabel),
      activeTab: this.state.currentPage,
      scrollValue: this.scrollValue,
      containerWidth: this.state.containerWidth,
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
        [ this.props.tabBarPosition === 'overlayTop' ? 'top' : 'bottom' ]: 0,
      }
    }
    return (
      <View style={ [ styles.container, this.props.style ] } onLayout={ this._handleLayout }>
        { this.props.tabBarPosition === 'top' && this.renderTabBar(tabBarProps) }
        { this.renderScrollableContent() }
        { (this.props.tabBarPosition === 'bottom' || overlayTabs) && this.renderTabBar(tabBarProps) }
        { this.props.parentAnimationValue && <Animated.Code
          exec={
            Animated.block([
              Animated.cond(
                Animated.defined(this.props.parentAnimationValue),
                [ Animated.set(this.props.parentAnimationValue, this.scrollValue) ]
              ),
            ])
          }
        />
        }
        <Animated.Code
          exec={ Animated.block([
            Animated.call([ this.positionAndroid, this.offsetAndroid ], (value) => {
              console.log(value)
              if (this.props.onScroll) {
                this.props.onScroll(value[ 0 ] + value[ 1 ])
              }
            }),
          ]) }
        />
      </View>
    )
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

export default GScrollableTabViewAndroid
