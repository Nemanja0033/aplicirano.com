import { Loader2 } from 'lucide-react'
import Loader from './Loader'

const GlobalLoader = () => {
  return (
    <div className='z-[9999] absolute mx-auto flex w-full h-screen justify-center items-center'>
      <Loader type='NORMAL' />
    </div>
  )
}

export default GlobalLoader