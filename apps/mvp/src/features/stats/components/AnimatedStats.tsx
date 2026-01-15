import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, latest => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.5,
      ease: "easeOut"
    })
    return controls.stop
  }, [value])

  return <motion.b className="text-2xl">{rounded}</motion.b>
}

export default AnimatedNumber
