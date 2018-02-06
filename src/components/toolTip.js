import React from 'react';
import { formatMoney } from '../utils/money';

//import styles
import './toolTip.css';

const ToolTip = ({ point }) => {

  //Calculate ToolTip location 
  const svg = document.getElementsByClassName("linechart")[0];
  const svgLocation = svg ? svg.getBoundingClientRect() : null;
  const left = (svgLocation.width / 30) * point.x - 60;

  return (
    <div className="tool-tip" style={{ left: left }}>
      <div className="tool-tip__date">{point.date}</div>
      <div className="tool-tip__price">{formatMoney(point.y)}</div>
    </div>
  );
}

export default ToolTip;
