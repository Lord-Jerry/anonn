import dayjs from "dayjs";

export const useTime = (time: Date) => {
  const form = dayjs(time);
  console.log(new Date().getFullYear(), +form.get("year"));
  if (new Date().getDate() === +form.format("D")) {
    return dayjs(time).format("hh:mm: A");
  } else {
    return dayjs(time).format("MMM D, YYYY");
  }
};
