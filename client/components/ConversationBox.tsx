import { AVATARS } from 'constants/index';
import dayjs from 'dayjs';
import ArrowLeft from 'icon/ArrowLeft';
import Dots from 'icon/Dots';
import Image from 'next/image';
import { myLoader } from 'utils/imageLoader';

type Props = {
  id: string;
  username: string;
  msg: string;
  time: Date;
  avatar: string;
  onSelect: (id: string) => void;
};

export default function ConversationBox(props: Props) {
  return (
    <>
      <div
        onClick={() => props.onSelect(props.id)}
        className="border-b-[.1px] border-b-[#53532D] flex bg-[#1E1E1E] justify-around items-center py-8 min-[600px]:w-[600px] w-[412px] h-[45px] mx-auto"
      >
        <div className="flex">
          <div>
            <Image
              loader={myLoader}
              src={props.avatar}
              alt="Picture of the author"
              width={45}
              height={45}
              className="rounded-lg mx-auto"
            />
          </div>
          <div className="p-2 w-[130px]">
            <p className="text-[10px]">@{props.username}</p>
            <p className="text-[10px] max-w-[150px] text-ellipsi whitespace-nowrap overflow-hidden">
              {props.msg}
            </p>
          </div>
        </div>
        <div>
          <p className="text-[10px]">{dayjs(props.time).format('hh:mm:a')}</p>
        </div>
      </div>
    </>
  );
}
