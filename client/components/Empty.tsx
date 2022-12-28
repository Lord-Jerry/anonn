import { FC, ReactElement } from "react";
import { ShareBtn } from "./ShareBtn";


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
      <ShareBtn urlLink={link}/>
    </div>
  );
}

export default Empty;
