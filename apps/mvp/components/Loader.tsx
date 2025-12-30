import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

const Loader = ({ type }: { type: "NORMAL" | "WAITING_FOR_PDF"}) => {
  
  if(type === 'WAITING_FOR_PDF'){
    return  <div className="flex absolute bg-white dark:bg-black z-50 left-0 top-0 overflow-hidden items-center justify-center w-full h-screen">
                <span className="animate-pulse">Conveverting to PDF. . .</span>
            </div>
  }
  
  else return (
    <div className="flex absolute z-50 left-0 top-0 overflow-hidden items-center justify-center w-full h-screen">
        {/* <Loader2 size={30} className="animate-spin text-primary" /> */}
        {[1,2,3].map((l) => (
          <motion.div initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.1 * l, repeat: Infinity, repeatType:"reverse", ease: "easeInOut"}} className="bg-primary rounded-full w-3 h-3 ml-2" />
        ))}
    </div>
  )
}

export default Loader