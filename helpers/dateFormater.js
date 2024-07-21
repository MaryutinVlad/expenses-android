export default function formatDate() {
  
  const date = new Date(Date.now())
  const isNight = date.getHours() < 6 || date.getHours() > 21
  const weekDays = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months =  [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ]
  const weekday = weekDays[date.getDay()]
  const month = months[date.getMonth()]
  let dayOfMonth = String(date.getDate())

  if (dayOfMonth.indexOf("1") >= 0 && dayOfMonth.indexOf("1") !== "11") {
    dayOfMonth = dayOfMonth.concat("st")
  } else if (
    dayOfMonth.indexOf("2") >= 0 && dayOfMonth.indexOf("2") !== "12"
  ) {
    dayOfMonth = dayOfMonth.concat("nd")
  } else {
    dayOfMonth = dayOfMonth.concat("th")
  }

  return {
    formatedDate: `${month} ${weekday} ${dayOfMonth}`,
    isNight
  }
}