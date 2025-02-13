export default function shortenValue(value) {

  let shortenedValue;

  if (value < 1000000000) {
    shortenedValue = (value / 1000000).toFixed(1) + 'M';
  }

  return shortenedValue;
}