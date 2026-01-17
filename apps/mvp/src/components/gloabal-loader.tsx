import { Loader2 } from 'lucide-react'

const GlobalLoader = () => {
  return (
    <div className='bg-black/10 z-[9999] fixed flex w-full h-screen justify-center items-center'>
        <Loader2 className='text-primary animate-spin' />
    </div>
  )
}

export default GlobalLoader