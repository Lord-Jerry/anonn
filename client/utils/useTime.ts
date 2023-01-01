import dayjs from "dayjs";

export const useTime = (time: Date) => {
  const form = dayjs("2023-01-01").format("DD/MM/YYYY");
  console.log(dayjs().isSame(form), "day", form);
  if (dayjs().isSame("2023-01--1", "year")) {
    return dayjs(time).format("hh:mm:A");
  } else if (dayjs("2019-01-25T00:00:00-02:00Z").isSame(new Date(), "week")) {
    return dayjs("2019-01-25T00:00:00-02:00Z").format("dddd");
  } else if (dayjs("2019-01-25T00:00:00-02:00Z").isSame(new Date(), "month")) {
    return dayjs("2019-01-25T00:00:00-02:00Z").format("ll");
  } else {
    // return moment(time).fromNow();
  }
};
