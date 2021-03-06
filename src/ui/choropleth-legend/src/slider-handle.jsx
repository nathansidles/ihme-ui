import React, { PropTypes } from 'react';
import classNames from 'classnames';
import interact from 'interact.js';

import style from './slider-handle.css';
import SvgText from '../../svg-text';

const propTypes = {
  /* top margin applied within svg document handle is placed within; used to calc origin offset */
  marginTop: PropTypes.number,

  /* left margin applied within svg document handle is placed within; used to calc origin offset */
  marginLeft: PropTypes.number,

  /* the height of element (path, line, rect) that the slider will sit atop, in px */
  height: PropTypes.number,

  /* position of handle along x-axis (in pixel space) */
  position: PropTypes.number,

  /* range extent value (in data space) */
  label: PropTypes.number,

  /* fn of signature function(mouse::clientX, whichHandle) */
  onSliderMove: PropTypes.func,

  which: PropTypes.oneOf(['x1', 'x2'])
};

const defaultProps = {
  marginTop: 0,
  marginLeft: 0,
  position: 0,
  height: 15,
  label: null,
  which: 'x1'
};

export default class SliderHandle extends React.Component {
  constructor(props) {
    super(props);

    this.storeReference = this.storeReference.bind(this);
    this.onHandleMove = this.onHandleMove.bind(this);
  }

  componentDidMount() {
    this.bindInteract(this._handle);
  }

  componentWillUnmount() {
    this._interactable.off('dragmove', this.onHandleMove);
  }

  onHandleMove(evt) {
    const { onSliderMove, which } = this.props;
    onSliderMove(evt.clientX, which);
  }

  storeReference(el) {
    this._handle = el;
  }

  bindInteract(el) {
    const { marginTop, marginLeft } = this.props;
    this._interactable = interact(el)
      .origin({ x: marginLeft, y: marginTop })
      .draggable({
        max: Infinity
      })
      .preventDefault('always')
      .styleCursor(false)
      .on('dragmove', this.onHandleMove);
  }

  render() {
    const { position, which, label, height } = this.props;
    const handleHeight = height + 5;

    return (
      <g
        className={classNames(style.handle)}
        ref={this.storeReference}
      >
        <rect
          transform={`translate(${which === 'x1' ? -5 : 0}, -2.5)`}
          x={`${position}px`}
          height={`${handleHeight}px`}
          stroke="none"
          fill="#000"
          width="5px"
        >
        </rect>
        <SvgText
          value={label}
          anchor={which === 'x1' ? 'end' : 'start'}
          x={position}
          dx={which === 'x1' ? -8 : 8}
          y={14}
        />
      </g>
    );
  }
}

SliderHandle.propTypes = propTypes;
SliderHandle.defaultProps = defaultProps;
