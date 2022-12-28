type Props = {
  tabs: {
    id: string;
    name: string;
    selected: boolean;
  }[];
  onSelect: (id: string) => void;
};

export const Tab = ({ tabs, onSelect }: Props) => {
  return (
    <div className="flex justify-around py-8 min-[600px]:w-[600px] w-[412px] mx-auto">
      {tabs.map((tab) => (
        <p
          key={tab.id}
          className={`tab ${tab.selected ? 'selected_tab' : ''}`}
          onClick={() => onSelect(tab.id)}
        >
          {tab.name}
        </p>
      ))}
    </div>
  );
};

export default Tab;
