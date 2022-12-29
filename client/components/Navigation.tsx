import ArrowLeft from 'icon/ArrowLeft';
import Dots from 'icon/Dots';
import Image from 'next/image';
import Link from 'next/link';
import { myLoader } from 'utils/imageLoader';

type Props = {
  title: string;
  imgSrc?: string;
  showDropdown?: boolean;
  backButton?: {
    onClick: () => void;
    disable: boolean;
  };
  backButtonLink?: string;
  children?: React.ReactNode;
};

export default function Navigation(props: Props) {
  return (
    <>
      <div className="flex justify-center">
        <div className="fixed bg-[#1E1E1E] flex justify-around items-center py-8 mb-4 min-[600px]:w-[600px] w-full h-[56px] mx-auto text-center">
          <>
            <Link
              href=""
              className="p-4 text-2xl"
              onClick={(e) => {
                e.preventDefault();
                if (props?.backButton?.disable) return;
                props?.backButton?.onClick();
              }}
            >
              <ArrowLeft />
            </Link>
            {props.imgSrc && (
              <Image
                loader={myLoader}
                src={props?.imgSrc}
                alt="avatar"
                width={30}
                height={30}
                className="rounded-lg"
              />
            )}
          </>
          <p className="text-center">{props.title}</p>
          <Dots />
        </div>
      </div>
      {props.children}
    </>
  );
}
