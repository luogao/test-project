import React, { Component, ReactChildren } from 'react'
import { Animated } from 'react-native'

type Props = {
  init
  scenes: ReactChildren
  contentProps: any
  onScroll: () => {}
  onScrollableContentRef: (ref: any) => void
  initialPage: number
  containerWidth: number
}

class ScrollableContent extends Component<Props> {
  private scrollXIOS: Animated.Value = new Animated.Value(0)
  private initOffsetX = { x: this.props.initialPage * this.props.containerWidth }

  handlePageScroll = Animated.event([{ nativeEvent: { contentOffset: { x: this.scrollXIOS } } }], {
    useNativeDriver: true,
    listener: this.props.onScroll,
  })

  render() {
    const { scenes, contentProps, onScrollableContentRef } = this.props
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        automaticallyAdjustContentInsets={false}
        contentOffset={this.initOffsetX}
        ref={onScrollableContentRef}
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
        {...contentProps}
      >
        {scenes}
      </Animated.ScrollView>
    )
  }
}

export default ScrollableContent
