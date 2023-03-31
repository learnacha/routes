function convertTimeToAMPMFormat(time: string): string {
  let [strHour, strMinute] = time.split(":");
  let hour = parseInt(strHour, 10);
  let minute = parseInt(strMinute, 10);

  const meridiem = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 === 0 ? 12 : hour % 12;

  const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
  const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

  return `${formattedHour}:${formattedMinute} ${meridiem}`;
}

function convertTimeTo24HourFormat(time: string): string {
  let [strHour, strMinute, meridiem] = time.split(/:|\s/);
  if (!meridiem) {
    meridiem = strMinute;
    strMinute = "00";
  }

  let hour = parseInt(strHour, 10);
  let minute = parseInt(strMinute, 10);


  if (meridiem.toLowerCase() === "pm" && hour !== 12) {
    hour += 12;
  } else if (meridiem.toLowerCase() === "am" && hour === 12) {
    hour = 0;
  }

  const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
  const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

  return `${formattedHour}:${formattedMinute}:00`;
}

export { convertTimeToAMPMFormat, convertTimeTo24HourFormat };
