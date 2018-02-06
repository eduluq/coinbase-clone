/* Receive a date with the format "2018-02-01" and returns it: '1 feb.'*/
export const formatDate = (str) => {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep',
                  'oct', 'nov', 'dic'];
  const [_, month, day] = str.split('-');
  return `${day} ${months[parseInt(month, 10) - 1]}.`;
}
