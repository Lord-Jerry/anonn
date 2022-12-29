// 404.js
import Link from 'next/link'

export default function FourOhFour() {
  return (
    <div className="mx-auto p-8 text-sm">
    <h1>Whatever it is you're looking for here, I seriously don't know...</h1>
    <Link href="/conversations" className='underline'>
        Get back home, ASAP!!!
    </Link>
  </div>
  )

}