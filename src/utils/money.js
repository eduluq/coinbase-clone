/* Receives a price with the format: '1128.2597' and returns '1,128.25 $'*/
export const formatMoney = (price) => {
  return price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' $';
}

/* Receives two amounts of money and calculates the variation (%) between them
   Example: a: 6,667.14, b: -10,468.70 -> return: '-38.91%'
*/
export const getPercentageVariation = (now, past) => {
  const sign = (now < past) ? '-' : ''
  return sign + (now / past * 100).toFixed(2) + ' %';
}
