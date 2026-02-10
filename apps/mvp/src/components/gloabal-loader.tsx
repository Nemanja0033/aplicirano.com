import { Loader2 } from 'lucide-react'

const GlobalLoader = () => {
  return (
    <div className='z-9999 fixed top-0 bg-black/30 flex w-full h-screen justify-center items-center pointer-events-auto'>
      <Loader2 className='text-primary animate-spin' />
    </div>
  )
}

export default GlobalLoader