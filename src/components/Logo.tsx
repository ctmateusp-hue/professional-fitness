import { motion } from 'framer-motion'
import { useState } from 'react'

interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
  animated?: boolean
}

export function Logo({ className = "", size = 120, showText = true, animated = false }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const circleSize = showText ? size * 0.7 : size
  const fontSize = showText ? size * 0.08 : 0

  const containerVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05
    }
  }

  const circleVariants = {
    initial: { 
      rotateY: 0
    },
    hover: { 
      rotateY: 10
    }
  }

  const decorativeVariants = {
    initial: { opacity: 0.7, scale: 1 },
    hover: { 
      opacity: 1, 
      scale: 1.1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const textVariants = {
    initial: { opacity: 0.9, y: 0 },
    hover: { 
      opacity: 1, 
      y: -2,
      transition: { duration: 0.3 }
    }
  }

  const logoContent = (
    <>
      <motion.svg 
        width={circleSize} 
        height={circleSize} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        variants={circleVariants}
        style={{ 
          filter: isHovered ? 'drop-shadow(0 8px 16px rgba(45, 55, 72, 0.15))' : 'drop-shadow(0 4px 8px rgba(45, 55, 72, 0.1))'
        }}
      >
        {/* Main circle background */}
        <motion.circle 
          cx="100" 
          cy="100" 
          r="85" 
          fill="#2D3748" 
          stroke="none"
          whileHover={animated ? { 
            fill: "#1A202C",
            transition: { duration: 0.3 }
          } : undefined}
        />
        
        {/* Dynamic lightning bolt decorative elements */}
        <motion.g 
          fill="#E2E8F0"
          variants={decorativeVariants}
        >
          <motion.path 
            d="M55 65 L75 55 L65 75 Z"
            variants={decorativeVariants}
            whileHover={animated ? { 
              fill: "#F7FAFC",
              transition: { duration: 0.2 }
            } : undefined}
          />
          <motion.path 
            d="M145 125 L165 115 L155 135 Z"
            variants={decorativeVariants}
            whileHover={animated ? { 
              fill: "#F7FAFC",
              transition: { duration: 0.2, delay: 0.05 }
            } : undefined}
          />
          <motion.path 
            d="M45 135 L65 125 L55 145 Z"
            variants={decorativeVariants}
            whileHover={animated ? { 
              fill: "#F7FAFC",
              transition: { duration: 0.2, delay: 0.1 }
            } : undefined}
          />
          <motion.path 
            d="M155 65 L175 55 L165 75 Z"
            variants={decorativeVariants}
            whileHover={animated ? { 
              fill: "#F7FAFC",
              transition: { duration: 0.2, delay: 0.15 }
            } : undefined}
          />
        </motion.g>
        
        {/* CT Letters - Bold and clean */}
        <motion.g 
          fill="white"
          whileHover={animated ? {
            fill: "#F7FAFC",
            transition: { duration: 0.3 }
          } : undefined}
        >
          {/* Letter C */}
          <path d="M65 75 C55 75 50 85 50 100 C50 115 55 125 65 125 L75 125 C80 125 85 120 85 115 L85 110 L75 110 L75 115 C75 117 73 117 70 117 L65 117 C60 117 58 112 58 100 C58 88 60 83 65 83 L70 83 C73 83 75 83 75 85 L75 90 L85 90 L85 85 C85 80 80 75 75 75 Z"/>
          
          {/* Letter T */}
          <rect x="95" y="75" width="50" height="8"/>
          <rect x="115" y="75" width="10" height="50"/>
        </motion.g>
      </motion.svg>
      
      {showText && (
        <motion.div 
          className="mt-1 text-center"
          variants={textVariants}
        >
          <div 
            className="font-bold tracking-widest text-foreground"
            style={{ fontSize: `${fontSize}rem`, lineHeight: 1.2 }}
          >
            MATEUS PAVANELLO
          </div>
        </motion.div>
      )}
    </>
  )

  if (!animated) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {logoContent}
      </div>
    )
  }

  return (
    <motion.div 
      className={`flex flex-col items-center cursor-pointer ${className}`}
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {logoContent}
    </motion.div>
  )
}