import React, { Component, ReactNode } from 'react'
import {
  View,
  StyleSheet,
  ViewPagerAndroid,
  LayoutChangeEvent,
  ViewPagerAndroidProps,
  NativeSyntheticEvent,
  ViewPagerAndroidOnPageSelectedEventData,
  ViewPagerAndroidOnPageScrollEventData,
} from 'react-native'
import _ from 'lodash'
import { Props, State, TabBarProps } from './types';
import { DEFAULT_CONTAINER_WIDTH, DEFAULT_ON_CHANGE_DEBOUNCE } from './constants'

import SceneComponent from './SceneComponent'
import Animated, { call } from 'react-native-reanimated';
const DefaultTabBar = require('./DefaultTabBar');

const AnimatedViewPagerAndroid = Animated.createAnimatedComponent(ViewPagerAndroid)


interface AnimatedViewPager extends ViewPagerAndroidProps {
  getNode: () => ViewPagerAndroid
}


export default class ScrollableTabView extends Component<Props, State> {
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

  private scrollView: null | AnimatedViewPager = null
  private scrollValue: Animated.Value | Animated.AnimatedAddition = new Animated.Value(0)
  private offsetAndroid: Animated.Value = new Animated.Value(0)
  private positionAndroid: Animated.Value = new Animated.Value(this.props.initialPage || 0)
  private containerWidthAnimationValue: Animated.Value = new Animated.Value(DEFAULT_CONTAINER_WIDTH)
  private containerWidth = DEFAULT_CONTAINER_WIDTH

  constructor (props: Props) {
    super(props)
    this.state = this.getInitialState()
    this._updateSelectedPage = _.debounce(this._updateSelectedPage.bind(this), this.props.onChangeDebounce || DEFAULT_ON_CHANGE_DEBOUNCE)
  }

  componentWillReceiveProps (props: Props) {
    // if (props.children !== this.props.children) {
    //   console.log('props.children', props.children)
    //   console.log('this.props.children', this.props.children)
    //   this.updateSceneKeys({ page: this.state.currentPage, children: props.children, from: 'componentWillReceiveProps' });
    // }

    if (props.page && props.page >= 0 && props.page !== this.state.currentPage) {
      console.log('componentWillReceiveProps🌟')
      this.goToPage(props.page);
    }
  }

  componentWillUnmount () {
    this.positionAndroid.removeAllListeners();
    this.offsetAndroid.removeAllListeners();
  }

  private _onChangeTab = (prevPage: number, currentPage: number) => {
    console.log('? ? ? ?!!! _onChangeTab')
    this.props.onChangeTab && this.props.onChangeTab({
      i: currentPage,
      ref: this._children()[ currentPage ],
      from: prevPage,
    });
  }

  // 生成key值
  private _makeSceneKey = (child: ReactNode, idx: number) => {
    return child.props.tabLabel + '_' + idx
  }

  // 判断是否存在key
  private _keyExists = (sceneKeys: string[], key: string) => {
    return sceneKeys.find((sceneKey) => key === sceneKey)
  }

  // 根据传入的scene id 和当前的id 以及this.props.prerenderingSiblingsNumber 来决定是否需要渲染
  private _shouldRenderSceneKey = (idx: number, currentPageKey: number) => {
    let numOfSibling = this.props.prerenderingSiblingsNumber || 0
    return idx < currentPageKey + numOfSibling + 1 && idx > currentPageKey - numOfSibling - 1
  }

  private updateSceneKeys = ({ page, children = this.props.children, callback = () => { }, from }: { page: number, children?: ReactNode, callback?: () => void, from: string }) => {
    console.log('why updateSceneKeys🕵️‍♂️🕵️‍♂️🕵️‍♂️🕵️‍♂️🕵️‍♂️', from)
    let newKeys = this.newSceneKeys({ previousKeys: this.state.sceneKeys, currentPage: page, children, });
    this.setState({ currentPage: page, sceneKeys: newKeys, }, callback);
  }

  private getInitialState = () => {
    this.scrollValue = Animated.add(this.positionAndroid, this.offsetAndroid);

    // const callListeners = this._polyfillAnimatedValue(this.scrollValue);
    // let positionAndroidValue = this.props.initialPage || 0;
    // let offsetAndroidValue = 0;
    // this.positionAndroid.addListener(({ value, }) => {
    //   positionAndroidValue = value;
    //   callListeners(positionAndroidValue + offsetAndroidValue);
    // });
    // this.offsetAndroid.addListener(({ value, }) => {
    //   offsetAndroidValue = value;
    //   callListeners(positionAndroidValue + offsetAndroidValue);
    // });

    return {
      currentPage: this.props.initialPage,
      sceneKeys: this.newSceneKeys({ currentPage: this.props.initialPage, }),
    };
  }

  // 获取需要渲染的scene 的keys
  private newSceneKeys = ({ previousKeys = [], currentPage = 0, children = this.props.children }: { previousKeys?: string[], currentPage?: number, children?: ReactNode }) => {
    let newKeys: string[] = []
    this._children(children).forEach((child: ReactNode, idx: number) => {
      let key = this._makeSceneKey(child, idx)
      if (this._keyExists(previousKeys, key) || this._shouldRenderSceneKey(idx, currentPage)) {
        newKeys.push(key)
      }
    })
    return newKeys
  }

  // 遍历 this.porps.children
  private _children = (children = this.props.children) => {
    console.log('🍗🍗🍗🍗🍗')
    return React.Children.map(children, (child: ReactNode) => child)
  }


  // Animated.add and Animated.divide do not currently support listeners so
  // we have to polyfill it here since a lot of code depends on being able
  // to add a listener to `scrollValue`. See https://github.com/facebook/react-native/pull/12620.
  private _polyfillAnimatedValue = (animatedValue: Animated.Value | Animated.AnimatedAddition) => {

    const listeners = new Set();
    const addListener = (listener: ({ value }: { value: number }) => void) => {
      listeners.add(listener);
    };

    const removeListener = (listener: ({ value }: { value: number }) => void) => {
      listeners.delete(listener);
    };

    const removeAllListeners = () => {
      listeners.clear();
    };

    // @ts-ignore
    animatedValue.addListener = addListener;
    // @ts-ignore
    animatedValue.removeListener = removeListener;
    // @ts-ignore
    animatedValue.removeAllListeners = removeAllListeners;

    return (value: number) => listeners.forEach((listener: ({ value }: { value: number }) => void) => listener({ value, }));
  }

  private goToPage = (pageNumber: number) => {
    if (this.scrollView) {
      if (this.props.scrollWithoutAnimation) {
        this.scrollView.getNode().setPageWithoutAnimation(pageNumber);
      } else {
        this.scrollView.getNode().setPage(pageNumber);
      }
    }

    const currentPage = this.state.currentPage;
    this.updateSceneKeys({
      page: pageNumber,
      callback: this._onChangeTab.bind(this, currentPage, pageNumber),
      from: 'goToPage'
    });
  }

  private _onScroll = (e: NativeSyntheticEvent<ViewPagerAndroidOnPageScrollEventData>) => {
    console.log('_onScroll ? ? ?? ? ? ? ? ? ? ? ? ?')
    const { position, offset, } = e.nativeEvent;
    this.props.onScroll && this.props.onScroll(position + offset);
  }

  private _handleLayout = (e: LayoutChangeEvent) => {
    const { width, } = e.nativeEvent.layout;
    if (!width || width <= 0 || Math.round(width) === Math.round(this.containerWidth)) {
      return;
    }
    this.setContainerWidth(width)
    requestAnimationFrame(() => {
      this.goToPage(this.state.currentPage);
    });
  }

  private setContainerWidth = (value: number) => {
    this.containerWidth = value
    this.containerWidthAnimationValue.setValue(value)
  }

  private handlePageSelected = (e: NativeSyntheticEvent<ViewPagerAndroidOnPageSelectedEventData>) => {
    e.persist()
    this._updateSelectedPage(e)
  }

  private _updateSelectedPage = (nextPage: NativeSyntheticEvent<ViewPagerAndroidOnPageSelectedEventData>) => {

    console.log('_updateSelectedPage ???? ?', nextPage.nativeEvent)
    let localNextPage = nextPage.nativeEvent.position;
    const currentPage = this.state.currentPage;
    this.updateSceneKeys({
      page: localNextPage,
      callback: this._onChangeTab.bind(this, currentPage, localNextPage),
      from: '_updateSelectedPage'
    });
  }

  onScrollViewRef = (ref: AnimatedViewPager) => this.scrollView = ref

  handlePageScroll = Animated.event(
    [ {
      nativeEvent: {
        position: this.positionAndroid,
        offset: this.offsetAndroid,
      },
    }, ],
    {
      useNativeDriver: true,
      // listener: this._onScroll,
    },
  )

  renderScrollableContent = () => {
    console.log('renderScrollableContent ??~~~~~~~~~~~~~')
    const childrenLength = this._children().length
    return (
      <AnimatedViewPagerAndroid
        key={ childrenLength }
        style={ styles.scrollableContentAndroid }
        initialPage={ this.props.initialPage }
        onPageSelected={ this.handlePageSelected }
        keyboardDismissMode="on-drag"
        scrollEnabled={ !this.props.locked }
        onPageScroll={ this.handlePageScroll }
        ref={ this.onScrollViewRef }
        { ...this.props.contentProps }
      >
        { this._composeScenes() }
      </AnimatedViewPagerAndroid>
    )
  }

  _composeScenes = () => {
    return this._children().map((child: ReactNode, idx: number) => {
      let key = this._makeSceneKey(child, idx);
      return (
        <SceneComponent
          key={ child.key }
          shouldUpdate={ this._shouldRenderSceneKey(idx, this.state.currentPage) }
          containerWidth={ this.containerWidthAnimationValue }
        >
          { this._keyExists(this.state.sceneKeys, key) ? child : <View tabLabel={ child.props.tabLabel } /> }
        </SceneComponent>
      )
    })
  }

  renderTabBar = (props: TabBarProps) => {
    if (!!this.props.renderTabBar === false) {
      return null;
    } else if (this.props.renderTabBar) {
      return React.cloneElement(this.props.renderTabBar(props), props);
    } else {
      return <DefaultTabBar { ...props } />;
    }
  }

  render () {
    console.log('render render render render render🔞🔞🔞🔞🔞')
    let overlayTabs = (this.props.tabBarPosition === 'overlayTop' || this.props.tabBarPosition === 'overlayBottom');
    let tabBarProps: TabBarProps = {
      goToPage: this.goToPage,
      tabs: this._children().map((child: ReactNode) => child.props.tabLabel),
      activeTab: this.state.currentPage,
      scrollValue: (this.scrollValue as Animated.Value),
      containerWidth: this.containerWidth,
    };

    if (this.props.tabBarBackgroundColor) {
      tabBarProps.backgroundColor = this.props.tabBarBackgroundColor;
    }
    if (this.props.tabBarActiveTextColor) {
      tabBarProps.activeTextColor = this.props.tabBarActiveTextColor;
    }
    if (this.props.tabBarInactiveTextColor) {
      tabBarProps.inactiveTextColor = this.props.tabBarInactiveTextColor;
    }
    if (this.props.tabBarTextStyle) {
      tabBarProps.textStyle = this.props.tabBarTextStyle;
    }
    if (this.props.tabBarUnderlineStyle) {
      tabBarProps.underlineStyle = this.props.tabBarUnderlineStyle;
    }
    if (overlayTabs) {
      tabBarProps.style = {
        position: 'absolute',
        left: 0,
        right: 0,
        [ this.props.tabBarPosition === 'overlayTop' ? 'top' : 'bottom' ]: 0,
      };
    }

    return (
      // @ts-ignore
      <View style={ [ styles.container, this.props.style ] } onLayout={ this._handleLayout }>
        { this.props.tabBarPosition === 'top' && this.renderTabBar(tabBarProps) }
        { this.renderScrollableContent() }
        { (this.props.tabBarPosition === 'bottom' || overlayTabs) && this.renderTabBar(tabBarProps) }
        <Animated.Code exec={

          Animated.block([
            call([ this.positionAndroid, this.offsetAndroid ], (value) => {
              console.log(value)
            })
          ])
        } />
      </View>
    )


  }

  shouldComponentUpdate (nextProps: Props, nextState: State) {
    const _props = (
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
    )
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
});
