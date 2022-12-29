type Props = {
  tabs: {
    id: string;
    name: string;
    selected: boolean;
    hasNewMessage?: boolean;
  }[];
  onSelect: (id: string) => void;
};

export const Tab = ({ tabs, onSelect }: Props) => {
  return (
    <div className="flex justify-around py-8 min-[600px]:w-[600px] w-full mx-auto">
      {tabs.map((tab) => {
        const showNotification = !tab.selected && tab.hasNewMessage;
        const isSelected = tab.selected ? 'selected_tab' : '';
        return (
          <>
            <p
              key={tab.id}
              className={`tab ${isSelected} cursor-pointer inline-flex`}
              onClick={() => onSelect(tab.id)}
            >
              {tab.name}
              {showNotification && (
                <span className="bg-[#F8F886] w-[6.86px] h-[6px] rounded-full ml-2 mt-1" />
              )}
            </p>
          </>
        );
      })}
    </div>
  );
};

export default Tab;
