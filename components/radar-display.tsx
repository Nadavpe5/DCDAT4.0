import { Car, Map } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RadarDisplayProps {
  onViewMap: () => void
}

export function RadarDisplay({ onViewMap }: RadarDisplayProps) {
  return (
    <div className="glass p-5 rounded-3xl border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-base">Radar</h3>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-1">
          200m
        </Badge>
      </div>

      {/* Clean Radar Display */}
      <div className="relative w-full aspect-square max-w-[280px] mx-auto">
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-green-500/15 overflow-hidden">
          
          {/* Minimal Grid */}
          <div className="absolute inset-0">
            <div className="absolute inset-4 rounded-full border border-green-400/10"></div>
            <div className="absolute inset-12 rounded-full border border-green-400/15"></div>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-green-400/8"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-green-400/8"></div>
          </div>

          {/* Smooth Radar Sweep */}
          <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: '4s' }}>
            <div className="absolute top-1/2 left-1/2 w-px h-1/2 bg-gradient-to-t from-green-400/80 via-green-400/40 to-transparent transform -translate-x-px origin-bottom"></div>
            <div className="absolute inset-0 rounded-full" style={{
              background: `conic-gradient(from 0deg, rgba(34, 197, 94, 0.2) 0deg, rgba(34, 197, 94, 0.1) 20deg, transparent 40deg, transparent 360deg)`
            }}></div>
          </div>

          {/* Clean Radar Blips */}
          <div className="absolute inset-0">
            <div className="absolute top-[30%] left-[65%] w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
            <div className="absolute top-[45%] left-[35%] w-1 h-1 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.8s' }}></div>
            <div className="absolute top-[65%] left-[70%] w-1 h-1 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '1.2s' }}></div>
          </div>

          {/* Center Vehicle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 rounded-full bg-green-500/80 border border-green-400/50 flex items-center justify-center">
              <Car className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Minimal Info */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>3 targets</span>
          <span>GPS locked</span>
        </div>

        {/* Action Button */}
        <Button 
          variant="glass" 
          size="sm" 
          className="w-full mt-3 text-blue-400 border-blue-500/20 hover:bg-blue-500/10"
          onClick={onViewMap}
        >
          <Map className="mr-2 h-3 w-3" />
          View Map
        </Button>
      </div>
    </div>
  )
} 