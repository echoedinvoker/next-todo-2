export function converFormattedTimeToTimestamp(time: string) {
  const timeArray = time.trim().split(" ");
  if (timeArray.length === 1) {
    if (isNaN(Number(timeArray[0]))) {
      if (timeArray[0].includes("d")) {
        return parseInt(timeArray[0]) * 86400000;
      }
      if (timeArray[0].includes("h")) {
        return parseInt(timeArray[0]) * 3600000;
      }
      if (timeArray[0].includes("m")) {
        return parseInt(timeArray[0]) * 60000;
      }
      if (timeArray[0].includes("s")) {
        return parseInt(timeArray[0]) * 1000;
      }
    } else {
      return parseInt(timeArray[0]) * 60000;
    }
  }

  // if time is string such as '1d 2h 3m 4s' or '2h 3m'
  let milliseconds = 0;
  for (let i = 0; i < timeArray.length; i++) {
    const timeValue = parseInt(timeArray[i]);
    if (timeArray[i].includes("d")) {
      milliseconds += timeValue * 86400000;
    } else if (timeArray[i].includes("h")) {
      milliseconds += timeValue * 3600000;
    } else if (timeArray[i].includes("m")) {
      milliseconds += timeValue * 60000;
    } else if (timeArray[i].includes("s")) {
      milliseconds += timeValue * 1000;
    }
  }
  return milliseconds;
}
