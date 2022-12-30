import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <>
       <p className="text-xs text-center opacity-50 pt-8 pb-2">
        By signing in you agree to our
      </p>
      <p className="text-sm text-center text-[#F8F886] pb-8">
        <Link href="/pages/terms"> Terms of Service</Link>,
        <Link href="/pages/privacy"> Privacy policy</Link>,
        <span className="opacity-50"> &</span> Cookie policy
      </p>
    </>
  )
}
