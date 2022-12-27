import { Tab } from 'types/tab';

export const markTabAsSelected = (tabs: Tab[], tabId?: string) => {
  return tabs.map((tab) => {
    if (tab.id === tabId) {
      return {
        ...tab,
        selected: true,
      };
    }

    return {
      ...tab,
      selected: tabId ? false : tab.selected,
    };
  });
};
