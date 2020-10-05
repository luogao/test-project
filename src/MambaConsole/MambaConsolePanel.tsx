import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import Tab from './components/Tab'
import Log from './components/Log'
import { LogDetailType, LogItemType, LogType } from './types/log'
import Button from './components/Button'
import { useBackHandler } from './hooks/useBackHandler'

enum TabName {
  Log = 'Log',
  System = 'System',
  MambaBundle = 'Mamba Bundle'
}

type State = {
  activeTab: TabName
  logs: LogItemType[]
  logArr: []
}

type Props = {
  visible: boolean
  onClose: () => void
}

class MambaConsolePanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      logArr: [],
      activeTab: TabName.Log,
      logs: [],
    }
    console.log('123')
    console.log('123')
    console.log('123')
    console.log('123')
    console.log('123')
    console.info({ 123: 123 })
    console.warn('ahahah')
    console.log([1, 2, 3, 4, 5, 56])
    console.log(1, 2, 3, 4, 5)
    console.log([1, 2, 3, 4, { a: 1 }, [1234, 123, 2342, 1233, 22]])
    console.log({ a: 1 })
    console.log(null)
    console.log(undefined)
    console.log(this.handleTabChange)
    console.log(new Map())
    console.log(new Set())
  }

  componentWillUnmount() {
    //@ts-ignore
    global.consolePanelStack.removeListener(this.handleLogUpdate)
  }

  componentDidMount() {
    //@ts-ignore
    global.consolePanelStack.bindUpdateListener(this.handleLogUpdate)

    // useBackHandler(() => {
    //   if (this.props.visible) {
    //     this.handleHide()
    //     return true
    //   } else {
    //     return false
    //   }
    // })
  }

  handleLogUpdate = () => {
    let arr
    let output = []
    //@ts-ignore
    arr = global.consolePanelStack.getLogArr()
    output = arr.map((item, index) => {
      console.info('item.data', item.data)
      const r = item.data.map((data, key) => {
        return this.formatToString(data)
      })
      console.info({ r })
      console.info({ r: r.join(' ') })
      return { type: item.method, data: r.join(' '), date: item.date }
    })
    this.setState({
      logs: output,
    })
  }

  formatToString = (obj) => {
    console.info({ obj })
    //将各种结构的log转为String
    if (
      obj === null ||
      obj === undefined ||
      typeof obj === 'string' ||
      typeof obj === 'number' ||
      typeof obj === 'boolean' ||
      typeof obj === 'function'
    ) {
      return ` ${String(obj)}`
    } else if (obj instanceof Date) {
      return ` Date(${obj.toISOString()})`
    } else if (Array.isArray(obj)) {
      console.info(
        'obj.map((elem) => this.formatToString(elem))',
        obj.map((elem) => this.formatToString(elem))
      )
      return ` Array(${obj.length}) [${obj.map((elem) => this.formatToString(elem))} ]`
    } else if (obj.toString) {
      // return 'object{' + obj.toString() + '}';
      // 此处有问题，对象调用toString()返回为"[object Object]"
      return ` Object ${JSON.stringify(obj)}`
    } else {
      return 'unknown data'
    }
  }

  renderLogTab = () => {
    return <Log logs={this.state.logs} />
  }

  renderSystemTab = () => {
    return <Text> system </Text>
  }

  renderMambaBundleTab = () => {
    return <Text> bundle info </Text>
  }

  tabs = [
    {
      label: TabName.Log,
      render: this.renderLogTab,
    },
    {
      label: TabName.System,
      render: this.renderSystemTab,
    },
    {
      label: TabName.MambaBundle,
      render: this.renderMambaBundleTab,
    },
  ]

  handleTabChange = (tab: string) => {
    this.setState({
      activeTab: tab as TabName,
    })
  }

  handleHide = () => {
    this.props.onClose()
  }

  handleClear = () => {
    console.log('clear')
    // @ts-ignore
    global.consolePanelStack.clear()
  }

  render() {
    if (!this.props.visible) return null
    return (
      <>
        <TouchableOpacity onPress={this.handleHide} style={styles.overlay} activeOpacity={1} />
        <View style={styles.panelWrapper}>
          <Tab tabs={this.tabs} activeTab={this.state.activeTab} onChange={this.handleTabChange} />
          <View style={styles.actionButtonGroup}>
            <Button label='clear' onPress={this.handleClear} style={styles.actionButton} />
            <Button label='hide' onPress={this.handleHide} style={styles.actionButton} />
          </View>
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    ...StyleSheet.absoluteFillObject,
  },
  panelWrapper: {
    width: '100%',
    height: '70%',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#eff0f4',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#eff0f4',
    borderColor: '#dedfe0',
    paddingBottom: 30,
  },
})

export default MambaConsolePanel
