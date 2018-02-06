import { formatDate } from './date';

/*
  Returns an array of the previous 31 days' worth of bitcoin data from https://www.coindesk.com/api/
  using the next format:
  [{
   date: "06 ene."
   x: 0 (from 0 to 31)
   y: 17135.8363 ($ Bitcoin Price Index)
  }, {...}]
*/
export const getHistoricalDataApi = () => {
  return new Promise((resolve, reject) => {
    const url = 'https://api.coindesk.com/v1/bpi/historical/close.json';
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const formattedData = Object.keys(data.bpi).map((key, index) => ({
          date: formatDate(key),
          x: index,
          y: data.bpi[key],
        }));
        resolve(formattedData);
      })
      .catch(error => {
        reject(error);
      })
  })
}

/* Returns real time bitcoin data from https://www.coindesk.com/api/ using its format.
{
  bpi: {
    EUR: {code: "EUR", rate: "5,524.3709", description: "Euro", rate_float: 5524.3709},
    USD: {code: "USD", rate: "6,841.0213", description: "United States Dollar", rate_float: 6841.0213},
  },
  disclaimer: "This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org",
  time: {
    updated: "Feb 6, 2018 01:16:00 UTC",
    updatedISO: "2018-02-06T01:16:00+00:00",
    updateduk:"Feb 6, 2018 at 01:16 GMT",
  },
}
*/
export const getRealTimeDataApi = () => {
  return new Promise((resolve, reject) => {
    const url = 'https://api.coindesk.com/v1/bpi/currentprice/EUR.json';
    fetch(url)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}
