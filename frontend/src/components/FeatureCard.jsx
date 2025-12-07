import React from 'react'
import { motion } from 'framer-motion'
export default function FeatureCard({title, desc}){
  return (
    <motion.div whileHover={{y:-6}} className="glass-card p-6 rounded-xl shadow">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-2 text-gray-500">{desc}</div>
      <div className="mt-4 text-sm text-gray-400">Includes dashboards, alerts, and SOPs for operators.</div>
    </motion.div>
  )
}
