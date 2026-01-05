"use client"
import { SparklesIcon } from 'lucide-react'
import { ModeToggle } from './theme-toggler'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <div className='flex justify-end gap-2 items-center p-3 bg-transparent'>
        <Button size={'lg'}>Nadogradi na <span className='flex items-center gap-1 text-cyan-300 animate-pulse'><SparklesIcon /> Pro</span></Button>
        <ModeToggle />
    </div>
  )
}

export default Navbar