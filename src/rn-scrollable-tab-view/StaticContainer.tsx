import React from 'react'

type Props = {
  shouldUpdate: boolean
}

export default class StaticContainer extends React.Component<Props> {
  shouldComponentUpdate (nextProps: Props): boolean {
    return !!nextProps.shouldUpdate;
  }

  render () {
    const child = this.props.children;
    if (child === null || child === false) {
      return null;
    }
    return React.Children.only(child);
  }

}

