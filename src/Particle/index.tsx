import React, { Component } from 'react'
import Canvas from './Canvas'
import Particle from './Particle'

class index extends Component {
  render() {
    return (
      <>
        <Canvas width={400} height={400}>
          <Particle canvasWidth={400} canvasHeight={400} size={30} />
          {/* <Particle canvasWidth={400} canvasHeight={400} size={3} />
          <Particle canvasWidth={400} canvasHeight={400} size={3} /> */}
        </Canvas>
      </>
    )
  }
}

export default index
