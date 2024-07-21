export default function daysCounter(createdOn) {
  
  const currentTime = Date.now()
  const creationDate = new Date(createdOn)
  const daysPassed = Math.floor((currentTime - creationDate.getTime()) / 1000 / 60 / 60 / 24)
  
  return `${daysPassed} days passed`
}