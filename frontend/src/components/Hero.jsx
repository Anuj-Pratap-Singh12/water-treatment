import React from 'react'
import { motion } from 'framer-motion'
export default function Hero({onExplore}){
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <motion.h1 initial={{y:20, opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.1}} className="text-4xl font-extrabold leading-tight">Smart Water Recovery & Reuse</motion.h1>
        <motion.p initial={{y:20, opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2}} className="mt-4 text-gray-600">A premium platform for monitoring, optimizing, and automating the recovery and reuse of freshwater across industrial, agricultural, and municipal systems.</motion.p>

        <div className="mt-6 flex gap-4">
          <motion.button whileHover={{scale:1.03}} onClick={onExplore} className="px-6 py-3 rounded-lg bg-primary text-white font-semibold">Explore Dashboard</motion.button>
          <motion.a whileHover={{scale:1.03}} href="#learn" className="px-6 py-3 rounded-lg border">Learn More</motion.a>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-lg text-center">
            <div className="text-sm text-gray-400">Freshwater Saved</div>
            <div className="text-xl font-bold">1.2M L</div>
          </div>
          <div className="glass-card p-4 rounded-lg text-center">
            <div className="text-sm text-gray-400">Reuse Rate</div>
            <div className="text-xl font-bold">62%</div>
          </div>
          <div className="glass-card p-4 rounded-lg text-center">
            <div className="text-sm text-gray-400">Active Alerts</div>
            <div className="text-xl font-bold text-red-500">3</div>
          </div>
        </div>
      </div>
      <div className="rounded-xl p-6 glass-card shadow-lg">
        <div className="text-sm text-gray-500">Live Plant View</div>
        <div className="mt-4 h-72 bg-gradient-to-br from-white to-soft rounded-lg flex items-center justify-center"> 
          <svg width="320" height="220" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="20" width="120" height="80" rx="8" fill="#eefbf9" stroke="#c7f0ec" />
            <rect x="160" y="20" width="140" height="100" rx="8" fill="#eefbf9" stroke="#c7f0ec" />
            <circle cx="100" cy="160" r="36" fill="#eefbf9" stroke="#c7f0ec" />
            <text x="22" y="60" fill="#00695c" fontWeight="600">Inlet</text>
            <text x="200" y="60" fill="#00695c" fontWeight="600">Treatment Unit</text>
            <text x="74" y="165" fill="#00695c" fontWeight="600">Storage</text>
          </svg>
        </div>
      </div>
    </section>
  )
}
