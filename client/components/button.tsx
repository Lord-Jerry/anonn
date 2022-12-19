import { Component, JSXElementConstructor, ReactComponentElement, ReactElement } from "react";

const Themes = {
  white: 'bg-white text-black',
  black: '1E1E1E text-white'
} as const;

const Background = {
  bg_yellow: 'F8F886 text-black'
}

const Sizes = {
  sm: 'px-3 py-2',
  md: ''
} as const

type Props = {
  text: string;
  bg?: keyof typeof Background;
  icon?: JSX.Element;
  className?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
export default function Button(props: Props) {
  return (
    <button
      type="button"
      className={props.className}
      onClick={props.onClick}
    >
      {props.text}{props.icon}
    </button>
  );
}
