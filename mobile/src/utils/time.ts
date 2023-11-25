import dayjs from 'dayjs';

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
