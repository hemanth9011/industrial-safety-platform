import React from 'react'

interface WorkerAvatarProps {
  isMonitoring: boolean
  alertLevel: 'normal' | 'warning' | 'critical'
}

export default function WorkerAvatar({ isMonitoring, alertLevel }: WorkerAvatarProps) {
  return (
    <div className="w-full h-full flex items-center justify-center perspective">
      <style>{`
        @keyframes walk {
          0%, 100% { transform: translateX(-8px) rotateY(0deg); }
          50% { transform: translateX(8px) rotateY(5deg); }
        }
        
        @keyframes look-around {
          0%, 100% { transform: rotateY(0deg); }
          25% { transform: rotateY(-15deg); }
          75% { transform: rotateY(15deg); }
        }
        
        @keyframes gesture {
          0%, 100% { transform: rotateZ(-20deg); }
          50% { transform: rotateZ(20deg); }
        }
        
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotateZ(0deg); }
          50% { transform: rotateZ(-3deg); }
        }
        
        .worker-container {
          animation: ${isMonitoring ? 'walk 4s infinite' : 'bob 2s infinite'};
          perspective: 1000px;
        }
        
        .worker-head {
          animation: ${isMonitoring ? 'look-around 3s infinite' : 'none'};
        }
        
        .worker-arm {
          animation: ${isMonitoring ? 'gesture 2s infinite' : 'none'};
          transform-origin: top center;
        }
        
        .alert-shake {
          animation: ${alertLevel === 'critical' ? 'shake 0.3s infinite' : alertLevel === 'warning' ? 'sway 2s infinite' : 'none'};
        }
      `}</style>

      <div className={`worker-container alert-shake select-none ${
        alertLevel === 'critical' ? 'filter drop-shadow-lg' : ''
      }`}>
        {/* Helmet */}
        <div className="relative mb-1">
          <div className={`w-16 h-12 rounded-full mx-auto relative ${
            alertLevel === 'critical' ? 'bg-red-500' : 
            alertLevel === 'warning' ? 'bg-orange-500' : 
            'bg-yellow-400'
          } shadow-lg`}>
            {/* Helmet Shine */}
            <div className="absolute top-2 left-4 w-4 h-3 bg-white rounded-full opacity-40"></div>
            
            {/* Helmet Brim */}
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-2 rounded-full ${
              alertLevel === 'critical' ? 'bg-red-600' : 
              alertLevel === 'warning' ? 'bg-orange-600' : 
              'bg-yellow-500'
            }`}></div>
          </div>
        </div>

        {/* Head */}
        <div className="worker-head transition-transform duration-300">
          <div className="w-12 h-12 rounded-full bg-yellow-100 mx-auto shadow-md relative">
            {/* Eyes */}
            <div className="flex justify-between px-3 pt-3">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            
            {/* Beard */}
            <div className="absolute bottom-1 left-2 w-8 h-2 bg-amber-900 rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Body */}
        <div className="w-12 h-16 bg-orange-500 mx-auto shadow-lg relative">
          {/* Reflective Chest Stripe */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-3 bg-green-400 rounded-sm opacity-80 shadow-md"></div>
          
          {/* Reflective Waist Stripe */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-green-400 rounded-sm opacity-80"></div>

          {/* Arms Container */}
          <div className="absolute top-4 -inset-x-8 flex justify-between">
            {/* Left Arm */}
            <div className="w-3 h-12 bg-orange-500 rounded-full shadow-md"></div>
            
            {/* Right Arm (holding tablet) */}
            <div className="worker-arm">
              <div className="w-3 h-12 bg-orange-500 rounded-full shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Tablet */}
        {isMonitoring && (
          <div className="absolute right-0 top-12 w-6 h-8 bg-gray-800 rounded shadow-lg border border-blue-400">
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">
              📊
            </div>
          </div>
        )}

        {/* Legs */}
        <div className="flex justify-center gap-2 mt-1">
          <div className="w-2 h-10 bg-orange-500 rounded-sm shadow-md"></div>
          <div className="w-2 h-10 bg-orange-500 rounded-sm shadow-md"></div>
        </div>

        {/* Boots */}
        <div className="flex justify-center gap-2">
          <div className="w-4 h-3 bg-amber-900 rounded-b shadow-md"></div>
          <div className="w-4 h-3 bg-amber-900 rounded-b shadow-md"></div>
        </div>
      </div>
    </div>
  )
}
