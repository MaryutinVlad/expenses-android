export default function historyDateFormater(creationDate) {
  const currentDate = new Date()

  if (currentDate.toLocaleDateString() === creationDate) {
    return 'today'
  } else {
    const creationDateObject = new Date(creationDate)
    const dateArray = String(creationDateObject).split(" ").slice(0, 3)

    return `on ${dateArray[0]} ${dateArray[2]}`
  }
}