import dayjs from "dayjs";

export const useTime = (time: Date) => {
  const form = dayjs(time);
  console.log(+form.format("D"));
  if (new Date().getDate() === +form.format("D")) {
    return dayjs(time).format("hh:mm: A");
  } else if (new Date().getDate() - 7 === +form.format("D")) {
    return dayjs("2019-01-25T00:00:00-02:00Z").format("dddd");
  } else if (dayjs("2019-01-25T00:00:00-02:00Z").isSame(new Date(), "month")) {
    return dayjs("2019-01-25T00:00:00-02:00Z").format("ll");
  } else {
    // return moment(time).fromNow();
  }
};
