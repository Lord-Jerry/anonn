import Image from 'next/image';
import { myLoader } from 'utils/imageLoader';
import { useTime } from 'utils/useTime';

type Props = {
  id: string;
  username: string;
  msg: string;
  time: Date;
  avatar: string;
  hasNewMessage: boolean;
  onSelect: (id: string) => void;
};

export default function ConversationBox(props: Props) {
  return (
    <>
      <div
        onClick={() => props.onSelect(props.id)}
        className="border-b-[.1px] border-b-[#53532D] flex bg-[#1E1E1E] justify-around items-center py-8 min-[600px]:w-[600px] w-full h-[45px] mx-auto cursor-pointer"
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
        <div className="flex flex-col">
          <p
            className={`text-[10px] ${props.hasNewMessage && 'text-[#007AFF]'}`}
          >
            {useTime(props.time)}
          </p>
          {props.hasNewMessage && (
            <span className="bg-[#007AFF] text-center w-[6.86px] h-[6px] rounded-full ml-4 mt-2" />
          )}
        </div>
      </div>
    </>
  );
}
