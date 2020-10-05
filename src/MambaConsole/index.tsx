import React, { Component } from 'react'
import Panel from './MambaConsolePanel'
import Setup from './core/setup'
import Button from './components/Button'
import { BackHandler, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Movable from '../Movable'

type Props = {}

type State = {
  panelVisible: boolean
}

export default class MambaConsole extends Component<Props, State> {
  static setup = Setup

  constructor(props: Props) {
    super(props)
    this.state = {
      panelVisible: false,
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }

  private handleBack = () => {
    if (this.state.panelVisible) {
      this.handlePanelClose()
      return true
    } else {
      return false
    }
  }

  private handlePanelClose = () => {
    this.setState({
      panelVisible: false,
    })
  }

  private handleOpenPanel = () => {
    this.setState({
      panelVisible: true,
    })
  }

  render() {
    return (
      <>
        {!this.state.panelVisible && (
          <Movable>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.mButton}
              onPress={this.handleOpenPanel}
            >
              <Image
                source={require('./images/icon_button.png')}
                resizeMode='contain'
                resizeMethod='resize'
                style={styles.mButtonIcon}
              />
            </TouchableOpacity>
          </Movable>
        )}

        <Panel visible={this.state.panelVisible} onClose={this.handlePanelClose} />
      </>
    )
  }
}

const ButtonSize = 58
const ButtonIconSize = 68

const styles = StyleSheet.create({
  mButton: {
    backgroundColor: '#f9b81e',
    width: ButtonSize,
    height: ButtonSize,
    borderRadius: ButtonSize / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mButtonIcon: {
    width: ButtonIconSize,
    height: ButtonIconSize,
    position: 'absolute',
  },
})
