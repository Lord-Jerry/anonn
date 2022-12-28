import { RequestIcon } from "icon/RequestIcon";
import Share from "icon/Share";
import { FC, ReactElement } from "react";
import Button from "./button";
import { RWebShare } from "react-web-share";


interface EmptyProps {
    icon: ReactElement;
    text: string;
    link: string;
}
const Empty:FC<EmptyProps> =({icon, text, link})=> {
  return (
    <div className="mt-24 mx-auto text-center">
      <p className="mx-auto">{icon}</p>
      <p className="mx-auto py-2 text-[20px] w-[232px] font-semibold">{text}</p>
        <RWebShare
        data={{
          text: "As E dey hot, jump in and send me all your annoymous messages, mafohhh!!!!",
          url: "http://anonn.xyz/profile/lord_jay",
          title: "Anonn"
        }}
        onClick={() => console.info("share successful!")}
      >
      <Button
        onClick={() => console.log(link)}
        className="mt-12 mx-auto flex justify-center items-center bg-[#F8F886] text-black p-4 w-[269px] rounded-lg"
        text="Copy your link"
        icon={<Share />}
      />
      </RWebShare>
    
    </div>
  );
}

export default Empty;
