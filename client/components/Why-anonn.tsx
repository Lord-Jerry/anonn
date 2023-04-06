import AnnonMsgIcon from 'icon/AnnonMsgIcon';
import ArrowRight from 'icon/ArrowRight';
import EncryptedMsgIcon from 'icon/EncryptedMsgIcon';
import IphoneIcon from 'icon/IphoneIcon';
import MarkedIcon from 'icon/MarkedIcon';
import MessageIcon from 'icon/MessageIcon';
import Link from 'next/link';
import React from 'react';
import Button from './button';
import Features from './Features';

export default function Why() {
  return (
    <div>
      <div className="mx-4 bg-[url('/images/hero1.svg')] bg-auto bg-no-repeat bg-center h-96" />
      <div className="px-4">
        <h3 className="text-sm text-center opacity-50 pt-8">FEATURES</h3>
        <p className="text-center text-[32px] text-[#FEFEE7] font-[600]">
          Why Anonn?
        </p>
        <Features
          icon={<MessageIcon />}
          title="Chat-like Interface"
          desc="We have an easy to understand application flow for you to use for transactions"
        />
        <Features
          icon={<EncryptedMsgIcon />}
          title="Encrypted messages"
          desc="We have an easy to understand application flow for you to use for transactions"
        />
        <Features
          icon={<AnnonMsgIcon />}
          title="Create anonymous polls"
          desc="We have an easy to understand application flow for you to use for transactions"
        />
        <Link href={'https://github.com/Lord-Jerry/anonn'} target="_blank">
          <Button
            text="OPEN-SOURCE"
            bg="bg_yellow"
            onClick={() => null}
            className="mb-16 mx-auto flex justify-center items-center p-3 w-[355px] rounded-lg h-[57px]"
          />
        </Link>
      </div>
      <div className="bg-white rounded-xl pt-10 pb-2 mx-4">
        <div className="flex items-center flex-col">
          <IphoneIcon />
          <h3 className="text-black text-2xl text-left mt-4 font-semibold">
            Random usernames are <br /> generated for you
          </h3>
          {/* <div className="text-black text-base flex items-center ml-4 mt-4 w-[300px] my-2">
            <MarkedIcon />
            <p className="ml-2"> Get up to 1.95% annual interest daily </p>
          </div>
          <div className="text-black text-base flex items-center ml-4 w-[300px] my-2">
            <MarkedIcon />
            <p className="ml-2"> Withdraw instantly, any time </p>
          </div> */}
        </div>
        <div className="mx-auto w-[300px]">
          <Link href={'/profile'}>
            <Button
              text="Get started"
              bg="bg_yellow"
              onClick={() => null}
              icon={<ArrowRight />}
              className="font-semibold text-[14px] mt-8 mb-12 flex items-center px-2 w-[160px] rounded-md h-[50px]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
