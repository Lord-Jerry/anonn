import { Tab } from "types/tab";

export const conversationTabs: Tab[] = [
  {
    id: 'rejected',
    name: 'History',
    selected: false,
  },
  {
    id: 'active',
    name: 'Ongoing',
    selected: true,
  },
  {
    id: 'pending',
    name: 'Requests',
    selected: false,
  },
];
