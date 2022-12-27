import ArrowLeft from "icon/ArrowLeft";
import Dots from "icon/Dots";
import Link from "next/link";

type Props = {
  children?: React.ReactNode;
  text: string;
}

export default function Navigation(props: Props) {
  return (
    <>
      <div className="fixed bg-[#1E1E1E] flex justify-around items-center py-8 mb-4 w-[400px] h-[56px] mx-auto">
        <Link href="/conversations"><ArrowLeft /></Link>
        <p>{props.text}</p>
        <Dots />
      </div>
      {props.children}
    </>
  );
}
