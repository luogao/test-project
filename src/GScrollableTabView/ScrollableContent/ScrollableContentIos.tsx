import React, { Component } from 'react'
import Animated from 'react-native-reanimated'
import { DEFAULT_CONTAINER_WIDTH } from '../constants'
import { ScrollView } from 'react-native-gesture-handler'

type Props = {
  initialPage: number
  currentPage: number
  containerWidth: number
  locked: boolean
  onRef: React.RefObject<ScrollView>
  onSelectedPage: (page: number) => void
  contentProps: any
  onScroll: (value: number) => void
  scrollXIOS: Animated.Value<number>
}

class ScrollableContentIos extends Component<Props> {
  private _onMomentumScrollBeginAndEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x
    const page = Math.round(offsetX / this.props.containerWidth)
    if (this.props.currentPage !== page) {
      this.props.onSelectedPage(page)
    }
  }

  render() {
    return (
      <>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          automaticallyAdjustContentInsets={false}
          contentOffset={{ x: this.props.initialPage * this.props.containerWidth }}
          ref={this.props.onRef}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { x: this.props.scrollXIOS } } },
          ])}
          onMomentumScrollBegin={this._onMomentumScrollBeginAndEnd}
          onMomentumScrollEnd={this._onMomentumScrollBeginAndEnd}
          scrollEventThrottle={16}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={!this.props.locked}
          directionalLockEnabled
          alwaysBounceVertical={false}
          keyboardDismissMode='on-drag'
          {...this.props.contentProps}
        >
          {this.props.children}
        </Animated.ScrollView>
        {/* <Animated.Code
          exec={Animated.block([
            Animated.call([this.scrollXIOS], (value) => {
              console.log(value)
              if (this.props.onScroll) {
                this.props.onScroll(value[0] / this.props.containerWidth)
              }
            }),
          ])}
        /> */}
      </>
    )
  }
}

export default ScrollableContentIos
