import React, { ReactNode } from "react"
import { Animated } from "react-native"


// Animated.add and Animated.divide do not currently support listeners so
// we have to polyfill it here since a lot of code depends on being able
// to add a listener to `scrollValue`. See https://github.com/facebook/react-native/pull/12620.
export const _polyfillAnimatedValue = (animatedValue: Animated.Value | Animated.AnimatedAddition) => {
  const listeners = new Set()
  const addListener = (listener: ({ value }: { value: number }) => void) => {
    listeners.add(listener)
  }

  const removeListener = (listener: ({ value }: { value: number }) => void) => {
    listeners.delete(listener)
  }

  const removeAllListeners = () => {
    listeners.clear()
  }

  // @ts-ignore
  animatedValue.addListener = addListener
  // @ts-ignore
  animatedValue.removeListener = removeListener
  // @ts-ignore
  animatedValue.removeAllListeners = removeAllListeners

  return (value: number) =>
    listeners.forEach((listener: ({ value }: { value: number }) => void) => listener({ value }))
}

// 生成key值
export const _makeSceneKey = (child: ReactNode, idx: number) => {
  return child.props.tabLabel + '_' + idx
}

// 判断是否存在key
export const _keyExists = (sceneKeys: string[], key: string) => {
  return sceneKeys.find((sceneKey) => key === sceneKey)
}


export const getChildren = (children: ReactNode) => {
  console.log('🍗🍗🍗🍗🍗')
  return React.Children.map(children, (child: ReactNode) => child)
}

// 根据传入的scene id 和当前的id 以及this.props.prerenderingSiblingsNumber 来决定是否需要渲染
export const _shouldRenderSceneKey = (idx: number, currentPageKey: number, prerenderingSiblingsNumber: number) => {
  let numOfSibling = prerenderingSiblingsNumber || 0
  return idx < currentPageKey + numOfSibling + 1 && idx > currentPageKey - numOfSibling - 1
}

// 获取需要渲染的scene 的keys
export const newSceneKeys = ({
  previousKeys = [],
  currentPage = 0,
  children,
  prerenderingSiblingsNumber
}: {
  previousKeys?: string[]
  currentPage?: number
  children?: ReactNode,
  prerenderingSiblingsNumber: number
}) => {
  let newKeys: string[] = []
  getChildren(children).forEach((child: ReactNode, idx: number) => {
    let key = _makeSceneKey(child, idx)
    if (_keyExists(previousKeys, key) || _shouldRenderSceneKey(idx, currentPage, prerenderingSiblingsNumber)) {
      newKeys.push(key)
    }
  })
  return newKeys
}
