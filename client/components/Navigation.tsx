import ArrowLeft from "icon/ArrowLeft";
import Dots from "icon/Dots";
import Image from "next/image";
import Link from "next/link";
import { myLoader } from "utils/imageLoader";

type Props = {
  children?: React.ReactNode;
  text: string;
  src?: string;
};

export default function Navigation(props: Props) {
  return (
    <>
    <div className="flex justify-center">
      <div className="fixed bg-[#1E1E1E] flex justify-around items-center py-8 mb-4 min-[600px]:w-[600px] w-[412px] h-[56px] mx-auto text-center">
        {props.src ? (
          <Image
            loader={myLoader}
            src={props?.src}
            alt="avatar"
            width={45}
            height={45}
            className="rounded-lg"
          />
        ) : (
          <Link href="/conversations" className="p-4 text-2xl">
            <ArrowLeft />
          </Link>
        )}
        <p>{props.text}</p>
        {props.src ? (
          <Link href="/conversations" className="p-4 text-2xl">
            x
          </Link>
        ) : (
          <Dots />
        )}
      </div>
      </div>
      {props.children}
    </>
  );
}
