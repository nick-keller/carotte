
export const formatNumber = (number: number) =>
  Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(number)

export const formatPercentage = (number: number) =>
  Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(number)
