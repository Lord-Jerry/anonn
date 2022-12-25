import { RequestIcon } from "icon/RequestIcon";
import Share from "icon/Share";
import { FC } from "react";
import Button from "./button";


interface EmptyProps {
    icon: any;
    text: string;
    link: string;
}
const Empty:FC<EmptyProps> =({icon, text, link})=> {
  return (
    <div className="mt-24 mx-auto text-center">
      <p className="mx-auto">{icon}</p>
      <p className="mx-auto py-2 text-[20px] w-[232px] font-semibold">{text}</p>
      <Button
        onClick={() => console.log(link)}
        className="mt-12 mx-auto flex justify-center items-center bg-[#F8F886] text-black p-4 w-[269px] rounded-lg"
        text="Copy your link"
        icon={<Share />}
      />
    </div>
  );
}

export default Empty;
