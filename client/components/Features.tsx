import React from 'react'


export type Props = {
  title: string;
  icon: JSX.Element;
  desc: string;
};
export default function Features(props: Props) {
  return (
    <div className='text-center mx-auto my-12'>
      <div className='flex justify-center items-center text-xl text-[#FEFEE7]'>
        <p className='mr-2'>{props.icon}</p> 
        <p>{props.title}</p>
      </div>
      <p className='text-base mx-auto max-w-[315px] px-8 pt-3 leading-[25px]'>
      {props.desc}
      </p>
    </div>
  )
}
