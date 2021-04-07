const numberFormatter = Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
  notation: 'compact',
})

const rateFormatter = Intl.NumberFormat('en-US', {
  style: 'decimal',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

const percentageFormatter = Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
})

const secondsFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  second: '2-digit',
  hour12: false,
})

export const formatNumber = (number: number) =>
  isNaN(number) ? '' : numberFormatter.format(number)

export const formatPercentage = (number: number) =>
  isNaN(number) ? '' : percentageFormatter.format(number)

export const formatRate = (number: number) =>
  isNaN(number) ? '' : rateFormatter.format(number)

export const formatDate = (value: number | Date | string) =>
  dateFormatter.format(new Date(value))

export const formatTime = (value: number | Date | string) =>
  timeFormatter.format(new Date(value))

export const formatSeconds = (value: number | Date | string) =>
  secondsFormatter.format(new Date(value))
