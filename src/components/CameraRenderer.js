
import React from 'react';
import './CameraRenderer.scss';


class CameraRenderer extends React.Component {

  constructor( props ) {
    super( props )
    this.resizeObserver = new ResizeObserver( this.onResize )
  }

  componentDidMount() {
    this.props.camera.mount( this.$el )
    this.resizeObserver.observe(this.$el)
  }

  componentWillUnmount() {
    this.props.camera.unmount()
    this.resizeObserver.disconnect()
  }

  onResize = () => {
    this.props.camera.updateSize()
  }

  render() {
    return (
      <div
        className='CameraRenderer'
        ref={(el) => { this.$el = el; }}
      />
    );
  }
}

export default CameraRenderer;