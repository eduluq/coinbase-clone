import React, { Component } from 'react';
import { formatMoney, getPercentageVariation } from '../utils/money';

//import styles
import './infoBox.css';

class InfoBox extends Component {

  constructor(props) {
    super(props);
    this.state = { windowWidth: 0, windowHeight: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  }

  render() {
    const { realTimePrice, data } = this.props;
    const { windowWidth } = this.state;

    //Mobile
    if(windowWidth < 701) {
      return (
        <div className="info-box info-box--mobile">
          <div>
            <div className="info-box__item__data">
              {formatMoney(realTimePrice)}
            </div>
            <div className="info-box__item__label--mobile">
              {`${formatMoney(realTimePrice - data[0].y)} (${getPercentageVariation(realTimePrice, data[0].y)})`}
            </div>
          </div>
        </div>
      )
    }

    //Desktop
    return (
      <div className="info-box">
        <div className="info-box__item">
          <div className="info-box__item__data">{formatMoney(realTimePrice)}</div>
          <div className="info-box__item__label">Precio Bitcoin</div>
        </div>
        <div className="info-box__item">
          <div className="info-box__item__data">{formatMoney(realTimePrice - data[0].y)}</div>
          <div className="info-box__item__label">Desde el mes pasado (USD)</div>
        </div>
        <div className="info-box__item">
          <div className="info-box__item__data">{getPercentageVariation(realTimePrice, data[0].y)}</div>
          <div className="info-box__item__label">Desde el mes pasado (%)</div>
        </div>
      </div>
    )
  }
}

export default InfoBox;
