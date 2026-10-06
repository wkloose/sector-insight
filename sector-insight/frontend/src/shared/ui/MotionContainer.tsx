"use client"

import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

export interface MotionFadeInProps extends HTMLMotionProps<"div"> {
  delay?: number
  duration?: number
}

export const MotionFadeIn: React.FC<MotionFadeInProps> = ({
  children,
  delay = 0,
  duration = 0.35,
  className,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

