import React, { Component } from 'react'
import { Animated } from 'react-native'
import StaticContainer from './StaticContainer'



type Props = {
  shouldUpdate: boolean
  containerWidth: Animated.Value
}

class SceneComponent extends Component<Props> {
  shouldComponentUpdate (nextProps: Props) {
    return nextProps.shouldUpdate !== this.props.shouldUpdate && !!nextProps.shouldUpdate;
  }

  width = { width: this.props.containerWidth }

  render () {
    console.log('SceneComponent: FunctionComponent 🍣🍣🍣')
    const { shouldUpdate, ...rest } = this.props;
    return (
      <Animated.View style={ this.width } { ...rest }>
        <StaticContainer shouldUpdate={ shouldUpdate }>
          { this.props.children }
        </StaticContainer>
      </Animated.View>
    )
  }
}

export default SceneComponent;