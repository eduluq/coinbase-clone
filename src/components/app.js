import React, { Component } from 'react';
import { getHistoricalDataApi, getRealTimeDataApi } from '../utils/api';

//import styles
import './app.css';

//import components
import LineChart from './lineChart';
import ToolTip from './toolTip';
import InfoBox from './infoBox';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bpi: [], //historical bitcoin price index
      rt_bpi: 0, //real time bitcoin price index
      activePoint: null //hovered point on chart
    }
    this.onChartHover = this.onChartHover.bind(this);
  }

  componentDidMount() {

    //Get last month bitcoin price
    getHistoricalDataApi()
      .then(data => {
        this.setState({ bpi: data })
      })
      .catch(error => console.log('Error', error))

    //Get real time bitcoin price and update it every minute
    const getRealTimeData = () => {
      getRealTimeDataApi()
        .then(data => {
          this.setState({ rt_bpi: data.bpi.USD.rate_float })
        })
        .catch(error => console.log('Error', error))
    }
    getRealTimeData();
    setInterval(getRealTimeData, 1000 * 60);

  }

  onChartHover(point) {
    this.setState({ activePoint: point })
  }

  render() {
    const { bpi, rt_bpi, activePoint } = this.state;
    return (
      <div className="app">
        {bpi.length > 0 && rt_bpi > 0 && <InfoBox realTimePrice={rt_bpi} data={bpi}/> }
        <div className="tool-tip-container">
          {activePoint && <ToolTip point={activePoint} />}
        </div>
        {bpi.length > 0 && <LineChart data={bpi} onHover={this.onChartHover} />}
        <div className="footer">
          Bitcoin price chart. Powered by <a href="https://www.coindesk.com/price/">CoinDesk API</a>
        </div>
      </div>
    );
  }
}

export default App;
