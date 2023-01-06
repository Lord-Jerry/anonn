import { useState } from 'react';

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Toogle(props: Props) {
  const [checked, setChecked] = useState(props.checked);
  const handleChange = () => {
    const state = !checked;
    setChecked(state);
    props.onChange(state);
  };
  return (
    <label className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span className="ml-3 text-sm text-gray-900 dark:text-gray-300">
        {props.label}
      </span>
    </label>
  );
}
