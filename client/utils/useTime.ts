import moment from "moment";

export const useTime = (time: Date) => {
  if (moment(time).isSame(new Date(), "day")) {
    return moment(time).format("hh:mm:a");
  } else if (moment(time).isSame(new Date(), "week")) {
    return moment(time).format("dddd");
  } else if (moment(time).isSame(new Date(), "month")) {
    return moment(time).format("ll");
  } else {
    return moment(time).fromNow();
  }
};
