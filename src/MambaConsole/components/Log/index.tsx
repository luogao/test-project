import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import { LogItemType, LogType } from '../../types/log'
import Item from './Item'

type Props = {
  logs: LogItemType[]
}

type State = {}

class index extends Component<Props, State> {
  scrollViewRef = React.createRef<ScrollView>()

  constructor(props: Props) {
    super(props)
  }

  renderItem = (item: LogItemType, index: number) => {
    return <Item {...item} key={index} />
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.logs !== this.props.logs) {
      this.scrollToTop()
    }
  }

  scrollToTop = () => {
    if (this.scrollViewRef.current) {
      this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false })
    }
  }

  render() {
    return (
      <ScrollView ref={this.scrollViewRef} style={{ flex: 1 }} overScrollMode='never'>
        {this.props.logs.map(this.renderItem)}
      </ScrollView>
    )
  }
}

export default index
