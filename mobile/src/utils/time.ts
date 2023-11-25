import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(weekOfYear);

export const formatMessageTimestamp = (timestamp: Date) => {
  const now = dayjs();
  const messageTime = dayjs(timestamp);

  if (now.isSame(messageTime, 'day')) {
    return messageTime.format('HH:mm');
  } else if (now.isSame(messageTime.subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  } else if (now.isSame(messageTime, 'week')) {
    return messageTime.format('dddd');
  } else if (now.isSame(messageTime, 'year')) {
    return messageTime.format('MMM DD');
  }

  return messageTime.format('MMM DD, YYYY');
};

export const formatMessageGroupDate = (timestamp: Date) => {
  const now = dayjs();
  const messageTime = dayjs(timestamp);

  if (messageTime.isToday()) {
    return 'Today';
  } else if (messageTime.isYesterday()) {
    return 'Yesterday';
  } else if (now.isSame(messageTime, 'week')) {
    return messageTime.format('dddd');
  } else if (now.isSame(messageTime, 'year')) {
    return messageTime.format('dddd, MMM D');
  }

  return messageTime.format('MMM D, YYYY');
};
