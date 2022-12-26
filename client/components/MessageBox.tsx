import { AVATARS } from "constants/index";
import dayjs from "dayjs";
import ArrowLeft from "icon/ArrowLeft";
import Dots from "icon/Dots";
import Image from "next/image";
import { myLoader } from "utils/imageLoader";

type Props = {
  username: string;
  msg?: string;
  time?: string;
  avatar: string;
};

export default function MessageBox(props: Props) {
  return (
    <>
      <div className="border-b-[.1px] border-b-[#F8F886] flex bg-[#1E1E1E] justify-around items-center py-8 w-[400px] h-[45px] mx-auto">
        <div className="flex">
        <div>
          <Image
            loader={myLoader}
            src={props?.avatar}
            alt="Picture of the author"
            width={45}
            height={45}
            className="rounded-lg mx-auto"
          />
          </div>
        <div className="p-2 w-[130px]">
          <p className="text-[10px]">@{props.username}</p>
          <p className="text-[10px]">{props.msg}</p>
        </div>
        </div>
          <div>
          <p className="text-[10px]">{dayjs(props.time).format('hh:mm:a')}</p>
        </div>
      </div>
    </>
  );
}
