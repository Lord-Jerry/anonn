import Share from 'icon/Share';
import React, { FC } from 'react'
import { RWebShare } from 'react-web-share';
import Button from './button';
    
interface shareBtnProps {
    urlLink: string;
}
    export const ShareBtn:FC<shareBtnProps> =({urlLink}) =>{
      return (
        <>
        <RWebShare
        data={{
          text: "Chat with me on Anonn, masks on!",
          url: urlLink,
          title: "Anonn"
        }}
        onClick={() => console.info("share successful!")}
      >
      <Button
        onClick={() => (console.log(urlLink))}
        className="mt-12 mx-auto flex justify-center items-center bg-[#F8F886] text-black p-4 w-full rounded-lg"
        text="Share your profile link"
        icon={<Share />}
      />
      </RWebShare>
      </>
      )
    }
    
