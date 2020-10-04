import { LogType } from "../types/log"

const _setupGlobal = function (global) {
  ; (function (global) {
    console.disableYellowBox = true
    class ConsoleStack {
      cleared = false
      logData = []
      waiting = false
      listeners = []
      timeout = null

      constructor () {
        this.logData = []
        this.waiting = false
        this.listeners = []
      }

      addLogToArr (method, data) {
        //log数量增加
        if (this.cleared) {
          this.logData = []
          this.cleared = false
        }
        this.logData.unshift({ method: method, data: data, date: timestamp() })
        this.notifyListeners()
      }

      notifyListeners () {
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

      clear () {
        //清空log
        // this.logData.splice(0, this.logData.length)
        this.cleared = true
        this.logData = [ { method: LogType.Clear, data: [ 'Console was cleared' ], date: timestamp() } ]
        this.notifyListeners()
      }

      bindUpdateListener (callback) {
        this.listeners.push(callback) //变化执行函数
      }

      removeListener (listener) {
        this.listeners = this.listeners.filter((l) => l !== listener)
        console.info(this.listeners)
      }

      getLogArr () {
        return this.logData
      }
    }

    function formatter (len) {
      return (input) => {
        var str = String(input)
        var strLen = str.length
        return '0'.repeat(len - strLen) + input
      }
    }

    function timestamp () {
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

    function proxyConsole (console, ConsoleStack) {
      const methods = [ 'log', 'warn', 'debug' ]
      methods.forEach((method) => {
        var f = console[ method ]
        console[ '_' + method ] = f
        console[ method ] = function () {
          const log = Array.prototype.slice.call(arguments) //将argument转为数组
          console.info(log)
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


export default function setup () {
  //@ts-ignore
  _setupGlobal(global)
}