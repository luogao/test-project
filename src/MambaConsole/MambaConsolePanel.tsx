import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native'
import Tab from './components/Tab'
import Log from './components/Log'
import { LogDetailType, LogItemType, LogType } from './types/log'

const Height = Dimensions.get('window').height

enum TabName {
  Log = 'Log',
  System = 'System',
}

type State = {
  activeTab: TabName
  logs: LogItemType[]
  logArr: []
}

type Props = {}

class MambaConsolePanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      logArr: [],
      activeTab: TabName.Log,
      logs: [
        {
          type: LogType.Log,
          data: 'log',
          date: '',
        },
        {
          type: LogType.Wran,
          data: 'wran',
          date: '',
        },
        {
          type: LogType.Debug,
          data: 'debug',
          date: '',
        },
        {
          type: LogType.Info,
          data: 'info',
          date: '',
        },
      ],
    }
    console.log('123')
    console.info({ 123: 123 })
    console.warn('ahahah')
  }

  componentWillUnmount() {
    global.consolePanelStack.removeListener(this.handleLogUpdate)
  }

  componentDidMount() {
    //@ts-ignore
    global.consolePanelStack.bindUpdateListener(this.handleLogUpdate)
  }

  handleLogUpdate = () => {
    let arr
    let output = []
    //@ts-ignore
    arr = global.consolePanelStack.getLogArr()
    output = arr.map((item, index) => {
      const r = item.data.map((data, key) => {
        return this.formatToString(data)
      })
      return { type: item.method, data: r.join(' '), date: item.date }
    })
    this.setState({
      logs: arr,
    })
  }

  formatToString = (obj) => {
    //将各种结构的log转为String
    if (
      obj === null ||
      obj === undefined ||
      typeof obj === 'string' ||
      typeof obj === 'number' ||
      typeof obj === 'boolean' ||
      typeof obj === 'function'
    ) {
      return '"' + String(obj) + '"'
    } else if (obj instanceof Date) {
      return 'Date(' + obj.toISOString() + ')'
    } else if (Array.isArray(obj)) {
      return 'Array(' + obj.length + ')[' + obj.map((elem) => this.formatToString(elem)) + ']'
    } else if (obj.toString) {
      // return 'object{' + obj.toString() + '}';
      //此处有问题，对象调用toString()返回为"[object Object]"
      return 'object(' + JSON.stringify(obj) + ')'
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

  tabs = [
    {
      label: TabName.Log,
      render: this.renderLogTab,
    },
    {
      label: TabName.System,
      render: this.renderSystemTab,
    },
  ]

  handleTabChange = (tab: string) => {
    this.setState({
      activeTab: tab as TabName,
    })
  }

  render() {
    return (
      <>
        <View style={styles.overlay} />
        <View style={styles.wrapper}>
          <Tab tabs={this.tabs} activeTab={this.state.activeTab} onChange={this.handleTabChange} />
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    ...StyleSheet.absoluteFillObject,
  },
  wrapper: {
    width: '100%',
    height: Height * 0.7,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
})

let _setUpGlobal = function (global) {
  ;(function (global) {
    class ConsoleStack {
      logData = []
      waiting = false
      listeners = []
      timeout = null

      constructor() {
        this.logData = []
        this.waiting = false
        this.listeners = []
      }

      addLogToArr(method, data) {
        //log数量增加
        this.logData.unshift({ method: method, data: data, date: timestamp() })
        this.notifyListeners()
      }

      notifyListeners() {
        //若this.logData有变化，则通知监听器
        if (this.waiting) {
          return
        }
        this.timeout = setTimeout(() => {
          this.listeners.forEach((callback) => {
            callback()
            clearTimeout(this.timeout)
            this.waiting = false
          })
        }, 500)
        this.waiting = true
      }

      clearLogArr() {
        //清空log
        this.logData.splice(0, this.logData.length)
        this.notifyListeners()
      }

      bindUpdateListener(callback) {
        this.listeners.push(callback) //变化执行函数
      }

      removeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener)
      }

      getLogArr() {
        return this.logData
      }
    }

    function formatter(len) {
      return (input) => {
        var str = String(input)
        var strLen = str.length
        return '0'.repeat(len - strLen) + input
      }
    }

    function timestamp() {
      var d = new Date()
      let f2 = formatter(2)
      return (
        f2(d.getHours()) +
        ':' +
        f2(d.getMinutes()) +
        ':' +
        f2(d.getSeconds()) +
        '.' +
        formatter(3)(d.getMilliseconds())
      )
    }

    function proxyConsole(console, ConsoleStack) {
      let methods = ['log', 'warn', 'debug', 'info']
      methods.forEach((method) => {
        var f = console[method]
        console['_' + method] = f
        console[method] = function () {
          const log = Array.prototype.slice.call(arguments) //将argument转为数组
          ConsoleStack.addLogToArr(method, log)
          f.apply(console, arguments) //打印出来
        }
      })
    }

    if (!global.consolePanelStack) {
      let consolePanelStack = new ConsoleStack()
      global.consolePanelStack = consolePanelStack
      proxyConsole(global.console, consolePanelStack)
    }
  })(global)
}

//@ts-ignore
_setUpGlobal(global)

export default MambaConsolePanel
