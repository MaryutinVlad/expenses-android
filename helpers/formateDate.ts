const months =  [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

export function formateDate(date: string) {

  const isOldFormat = date.indexOf("/") < 0 ? true : false;

  // 4/13/2024 - new           13.4.2024 - old

  const suffixes = [ "st", "nd", "rd", "th"];

  let [ day, month, year ] = "";

  if (isOldFormat) {
    [ day, month, year ] = date.split(".");
  } else {
    [ month, day, year ] = date.split("/");
  }

  const monthIndex = Number(month) - 1;

  let suffixedDay = day;

  if (day === "1" || (day.length === 2 && day[1] === "1" && day !== "11")) {
    suffixedDay += suffixes[0];
  } else if (day === "2" || (day.length === 2 && day[1] === "2" && day !== "12")) {
    suffixedDay += suffixes[1];
  } else if (day === "3" || (day.length === 2 && day[1] === "3" && day !== "13")) {
    suffixedDay += suffixes[2];
  } else {
    suffixedDay += suffixes[3];
  }

  return `${suffixedDay} of ${months[monthIndex]}, ${year}`;
}

export function formateShortDate(date: string) {
  
  const dateComponents = date.split("/").map(comp => Number(comp));

  return `${months[dateComponents[0] - 1]} ${dateComponents[1]}`
}