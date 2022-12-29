import React from 'react'

export default function Loader() {
  return (
   <svg viewBox="0 0 100 100" style={{width: '60px', height: '40px', margin: '0 auto', fontWeight: 'extrabold'}}>
  <defs>
    <linearGradient id="Gradient" x1="50%" y1="0%" x2="50%" y2="100%" >
      <stop offset="0%" stopColor="#D3FF56">
        <animate attributeName="stop-color" values="#D3FF56; #00AFAA; #D3FF56" dur="4s" repeatCount="indefinite"></animate>
      </stop>

      <stop offset="100%" stop-color="#00AFAA">
        <animate attributeName="stop-color" values="#00AFAA; #D3FF56; #00AFAA" dur="4s" repeatCount="indefinite"></animate>
      </stop>
    </linearGradient>
  </defs>
  <circle className="circle" cx="50" cy="50" r="30" fill="none"></circle>
</svg>
  )
}



