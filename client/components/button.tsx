const Background = {
  bg_yellow: 'bg-[#F8F886] text-black',
  bg_white: 'bg-[#fff] text-black',
  bg_black: 'bg-[#1E1E1E] text-white hover:bg-[#F8F886] hover:text-black'
}

export type Props = {
  text: string;
  bg?: keyof typeof Background;
  icon?: JSX.Element;
  className?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
export default function Button(props: Props) {
  const theme = props.bg ? Background[props.bg] : Background.bg_yellow;
  return (
    <button
      type="button"
      className={`${props.className} ${theme}`}
      onClick={props.onClick}
    >
      {props.text} {props.icon && <span className="ml-8 mt-1">{props.icon}</span>}
    </button>
  );
}
