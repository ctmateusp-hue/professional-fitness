interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export function Logo({ className = "", size = 120, showText = true }: LogoProps) {
  const circleSize = showText ? size * 0.7 : size
  const fontSize = showText ? size * 0.08 : 0
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={circleSize} height={circleSize} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main circle background */}
        <circle cx="100" cy="100" r="85" fill="#2D3748" stroke="none"/>
        
        {/* Dynamic lightning bolt decorative elements */}
        <g fill="#E2E8F0">
          <path d="M55 65 L75 55 L65 75 Z"/>
          <path d="M145 125 L165 115 L155 135 Z"/>
          <path d="M45 135 L65 125 L55 145 Z"/>
          <path d="M155 65 L175 55 L165 75 Z"/>
        </g>
        
        {/* CT Letters - Bold and clean */}
        <g fill="white">
          {/* Letter C */}
          <path d="M65 75 C55 75 50 85 50 100 C50 115 55 125 65 125 L75 125 C80 125 85 120 85 115 L85 110 L75 110 L75 115 C75 117 73 117 70 117 L65 117 C60 117 58 112 58 100 C58 88 60 83 65 83 L70 83 C73 83 75 83 75 85 L75 90 L85 90 L85 85 C85 80 80 75 75 75 Z"/>
          
          {/* Letter T */}
          <rect x="95" y="75" width="50" height="8"/>
          <rect x="115" y="75" width="10" height="50"/>
        </g>
      </svg>
      
      {showText && (
        <div className="mt-1 text-center">
          <div 
            className="font-bold tracking-widest text-foreground"
            style={{ fontSize: `${fontSize}rem`, lineHeight: 1.2 }}
          >
            MATEUS PAVANELLO
          </div>
        </div>
      )}
    </div>
  )
}