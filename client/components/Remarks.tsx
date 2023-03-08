import React, { useRef, useState } from 'react';

// Import Slider React components
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Quote from 'icon/Quote';
export default function Remarks() {
  const sliderRef = useRef<InstanceType<typeof Slider>>(null);
  const [dotState, setDotState] = useState(1);
  const targetDot = (x: number) => {
    sliderRef?.current?.slickGoTo(x - 1);
    setDotState(x - 1);
  };
  const settings: Settings = {
    className: 'center',
    infinite: false,
    dots: true,
    centerPadding: '60px',
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    variableWidth: true,
    appendDots: (dots) => (
      <ul className="!pt-4">
        {[1, 2, 3].map((x) => (
          <li
            className={
              dotState === x
                ? 'rounded-lg !w-[34px] bg-[#fefe86] !h-3 !mb-[-1.5rem]'
                : 'rounded-lg !w-3 !h-3 bg-white !mb-[-1.5rem]'
            }
            onClick={() => targetDot(x)}
          ></li>
        ))}
      </ul>
    ),
    afterChange: function (index: any) {
      setDotState(index + 1);
    },
  };
  console.log(dotState);
  return (
    <div className="mt-16">
      <h2 className="text-2xl text-center text-[#FEFEE7] mb-8">
        “What people are saying”
      </h2>
      <Slider ref={sliderRef} {...settings} className="pl-4">
        {Array.from({ length: 3 }, (_, i) => i + 1).map((_, index) => (
          <div
            key={index}
            className="bg-white !w-[238px] h-[235px] rounded-lg p-5"
          >
            <Quote />
            <h3 className="text-black text-[13px] mt-4">
              "It’s so easy to use, the chat-like interface gives the App a
              friendly undertone. I love it"
            </h3>
          </div>
        ))}
      </Slider>
    </div>
  );
}
