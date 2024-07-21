export default function fakeDataGenerator(sample, monthsAmount=1, entriesPerWeek=3, entriesPerDay=0){

  const fakeData = {}
  let [ initialMonth, initialYear] = sample.expenses[0].date.split("/").map(unit => Number(unit))
  const monthsToRemotest = []

  for (let decrement = 0; decrement <= monthsAmount; decrement++) {
    
  }
  //console.log((initialMonth - monthsAmount) % 12)
  return fakeData
}