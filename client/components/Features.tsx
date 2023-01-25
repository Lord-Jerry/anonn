import MessageIcon from 'icon/MessageIcon'
import Link from 'next/link'
import React from 'react'


export type Props = {
  title: string;
  icon: JSX.Element;
  desc: string;
};
export default function Features(props: Props) {
  return (
    <div className='text-center mx-auto my-12'>
      <p className='flex justify-center items-center text-xl'>
        {props.icon} {props.title}
      </p>
      <p className='text-sm mx-auto max-w-[315px]'>
      {props.desc}
      </p>
    </div>
  )
}
