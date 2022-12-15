const Themes = {
  white: 'bg-white text-black',
  black: '1E1E1E text-white'
} as const;

const Sizes = {
    sm: 'px-3 py-2',
    md: ''
} as const

type Props = {
  text: string;
  theme: keyof typeof Themes;
  icon?: string;
  size?: keyof typeof Sizes;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
export default function Button(props: Props) {
  const theme = Themes[props.theme]
  const size = Sizes[props.size || 'sm']

  return (
    <button
      type="button"
      className={`px-9 py-9 items-center rounded-md border border-transparent ${theme} ${size} w-64 px-3 py-2 text-sm font-medium leading-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
