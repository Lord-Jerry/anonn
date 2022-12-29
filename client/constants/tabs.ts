import { Tab } from "types/tab";

export const conversationTabs: Tab[] = [
  // {
  //   id: 'rejected',
  //   name: 'History',
  //   selected: false,
  //   hasNewMessage: false,
  // },
  {
    id: 'active',
    name: 'Ongoing',
    selected: true,
    hasNewMessage: true,
  },
  {
    id: 'pending',
    name: 'Requests',
    selected: false,
    hasNewMessage: true,
  },
];
