import ArrowLeft from "icon/ArrowLeft";
import Dots from "icon/Dots";

type Props = {
  children?: React.ReactNode;
  text: string;
}

export default function Navigation(props: Props) {
  return (
    <>
      <div className="fixed bg-[#1E1E1E] flex justify-around items-center py-8 mb-4 w-[400px] h-[56px] mx-auto">
        <ArrowLeft />
        <p>{props.text}</p>
        <Dots />
      </div>
      {props.children}
    </>
  );
}
