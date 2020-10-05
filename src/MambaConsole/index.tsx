import React, { Component } from 'react'
import Panel from './MambaConsolePanel'
import Setup from './core/setup'
import Button from './components/Button'
import { BackHandler, StyleSheet } from 'react-native'

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
        <Button
          activeOpacity={1}
          style={styles.mButton}
          labelStyle={styles.mButtonLabel}
          onPress={this.handleOpenPanel}
          label='mConsole'
        />

        <Panel visible={this.state.panelVisible} onClose={this.handlePanelClose} />
      </>
    )
  }
}

const styles = StyleSheet.create({
  mButton: {
    backgroundColor: '#c62a88',
  },
  mButtonLabel: {
    color: '#150485',
  },
})
