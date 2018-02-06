import React, { Component } from 'react';
import { formatMoney } from '../utils/money';

//import styles
import './lineChart.css';

const getMin = (data, key) => (
  data.reduce((min, b) => Math.min(min, b[key]), data[0][key])
);
const getMax = (data, key) => (
  data.reduce((max, b) => Math.max(max, b[key]), data[0][key])
);
const getSvgX = (x, maxX, svgWidth) => (x / maxX * svgWidth);
const getSvgY = (y, maxY, svgHeight) => (svgHeight - (y / maxY * svgHeight));

class LineChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      activePoint: {}
    }
    this.onHover = this.onHover.bind(this);
    this.startHover = this.startHover.bind(this);
    this.stopHover = this.stopHover.bind(this);
  }

  makePath(data, maxX, maxY, svgWidth, svgHeight, color) {
    //we create the svg path from the isolated points
    let path = `M ${getSvgX(data[0].x, maxX, svgWidth)} ${getSvgY(data[0].y, maxY, svgHeight)}`
    path += data.map(point =>
      `L ${getSvgX(point.x, maxX, svgWidth)} ${getSvgY(point.y, maxY, svgHeight)}`).join("");

    return <path className="linechart_path" d={path} style={{ stroke: color }} />
  }

  makeArea(data, maxX, maxY, svgWidth, svgHeight) {
    //we create the svg path from the isolated points
    let path = `M ${getSvgX(data[0].x, maxX, svgWidth)} ${getSvgY(data[0].y, maxY, svgHeight)}`
    path += data.map(point =>
      `L ${getSvgX(point.x, maxX, svgWidth)} ${getSvgY(point.y, maxY, svgHeight)}`).join("");
    //move to the bottom right of the chart
    path += `L ${getSvgX(maxX, maxX, svgWidth)} ${getSvgY(0, maxY, svgHeight)}`
    //then, to the bottom left to close it.
    path += `L ${getSvgX(0, maxX, svgWidth)} ${getSvgY(0, maxY, svgHeight)}`

    return <path className="linechart_area" d={path} />
  }

  makeAxis(minX, minY, maxX, maxY, svgWidth, svgHeight) {
    return (
      <g className="linechart_axis">
        <line
          x1={getSvgX(minX, maxX, svgWidth)} y1={getSvgY(0, maxY, svgHeight)}
          x2={getSvgX(maxX, maxX, svgWidth)} y2={getSvgY(0, maxY, svgHeight)}
          strokeDasharray="5"
        />
        <line
          x1={getSvgX(minX, maxX, svgWidth)} y1={getSvgY(maxY, maxY, svgHeight)}
          x2={getSvgX(maxX, maxX, svgWidth)} y2={getSvgY(maxY, maxY, svgHeight)}
          strokeDasharray="5"
        />
      </g>
    )
  }

  makePoint(point) {

    const { color, pointRadius, svgHeight } = this.props;

    return (
      <g className="linechart-active-point">
        <line
          className='linechart-active-point__line'
          x1={point.svgX} y1={0}
          x2={point.svgX} y2={svgHeight}
        />
        <circle
          className='linechart-active-point__circle'
          style={{ stroke: color }}
          r={pointRadius}
          cx={point.svgX}
          cy={point.svgY}
        />
      </g>
    );

  }

  onHover(e) {

    const { svgWidth, svgHeight, data, onHover } = this.props;
    const svgLocation = document.getElementsByClassName("linechart")[0].getBoundingClientRect();
    const adjustment = (svgLocation.width - svgWidth) / 2; //takes padding into consideration
    const relativeLoc = e.clientX - svgLocation.left - adjustment;

    const maxX = getMax(data, 'x');
    const maxY = getMax(data, 'y');

    const svgData = data.map(point => ({
        svgX: getSvgX(point.x, maxX, svgWidth),
        svgY: getSvgY(point.y, maxY, svgHeight),
        date: point.date,
    }));

    let closestPoint = {};
    for(let i = 0, c = 500; i < svgData.length; i++) {
      if (Math.abs(svgData[i].svgX - relativeLoc) <= c ) {
        c = Math.abs(svgData[i].svgX - relativeLoc);
        closestPoint = svgData[i];
      }
    }

    this.setState({ activePoint: closestPoint });

    //get point
    const p = data.find((p) => p.date === closestPoint.date);
    onHover(p);

  }

  startHover() {
    this.setState({ isHovered: true });
  }

  stopHover() {
    this.setState({ isHovered: false });
    this.props.onHover(null);
  }

  render() {

    const { data, svgWidth, svgHeight, color } = this.props;
    const { isHovered, activePoint } = this.state;
    const minX = getMin(data, 'x');
    const minY = getMin(data, 'y');
    const maxX = getMax(data, 'x');
    const maxY = getMax(data, 'y');

    return (
      <div
        className="linechart"
        onMouseMove={this.onHover}
        onMouseEnter={this.startHover}
        onMouseLeave={this.stopHover}
      >
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {this.makePath(data, maxX, maxY, svgWidth, svgHeight, color)}
          {this.makeArea(data, maxX, maxY, svgWidth, svgHeight)}
          {this.makeAxis(minX, minY, maxX, maxY, svgWidth, svgHeight)}
          {isHovered && this.makePoint(activePoint)}
        </svg>
        <span className="linechart_label" id="label-top-left">{formatMoney(maxY)}</span>
        <span className="linechart_label" id="label-top-right">{formatMoney(maxY)}</span>
        <span className="linechart_label" id="label-bottom-left">{formatMoney(maxX)}</span>
        <span className="linechart_label" id="label-bottom-right">{formatMoney(maxX)}</span>
        <div className="linechart_dates">
          <span className="linechart_label">{data[0].date}</span>
          <span className="linechart_label">{data[5].date}</span>
          <span className="linechart_label">{data[10].date}</span>
          <span className="linechart_label">{data[15].date}</span>
          <span className="linechart_label">{data[20].date}</span>
          <span className="linechart_label">{data[25].date}</span>
          <span className="linechart_label">{data[data.length - 1].date}</span>
        </div>
      </div>
    )
  }

}

LineChart.defaultProps = {
  data: [],
  color: '#FF9F1C',
  svgHeight: 300,
  svgWidth: 700,
  pointRadius: 5,
}

export default LineChart;
