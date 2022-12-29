// 404.js
import Navigation from 'components/Navigation'
import Link from 'next/link'

export default function FourOhFour() {
  return (
    <>
    <Navigation title="Page not found!!!" />
    <div className="flex justify-center items-center h-[100vh] w-full">
  <div className="mx-auto px-8 text-md">
    <h1 className="text-6xl">404</h1>
    <h1 className='text-lg'>Whatever it is you're looking for here, I seriously don't know...</h1>
    <h3 className="mt-6 text-xl">Go back to:</h3>
    <Link href="/conversations" className='underline text-[#f8f886] m-2 text-sm'>
        Conversations
    </Link><br/>
     <Link href="/profile" className='underline text-[#f8f886] m-2 text-sm'>
        Profile
    </Link>
  </div>
    </div>
  
  </>
  )

}