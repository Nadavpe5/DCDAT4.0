import { Car, Compass, RotateCcw } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface MapModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MapModal({ open, onOpenChange }: MapModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full h-[90vh] p-0 gap-0 bg-slate-900 border-slate-700">
        {/* Map Header */}
        <div className="glass-card p-4 border-0 rounded-t-xl border-b border-white/10">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="font-semibold">Navigation</h3>
              <p className="text-xs text-gray-400">Demo Route Active</p>
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {/* Street Grid Background */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}>
          </div>

          {/* Main Roads */}
          <div className="absolute inset-0">
            {/* Horizontal Main Road */}
            <div className="absolute top-1/2 left-0 right-0 h-12 bg-slate-700 transform -translate-y-1/2">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-yellow-400/60 transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 transform -translate-y-1/2" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, white 8px, white 12px)',
                backgroundSize: '20px 1px'
              }}></div>
            </div>

            {/* Vertical Cross Street */}
            <div className="absolute top-0 bottom-0 left-1/2 w-8 bg-slate-700 transform -translate-x-1/2">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-yellow-400/60 transform -translate-x-1/2"></div>
            </div>

            {/* Side Streets */}
            <div className="absolute top-[30%] left-0 right-0 h-6 bg-slate-700/80"></div>
            <div className="absolute top-[70%] left-0 right-0 h-6 bg-slate-700/80"></div>
            <div className="absolute top-0 bottom-0 left-[25%] w-6 bg-slate-700/80"></div>
            <div className="absolute top-0 bottom-0 left-[75%] w-6 bg-slate-700/80"></div>
          </div>

          {/* Demo Vehicle with Smooth Movement */}
          <div className="absolute top-1/2 transform -translate-y-1/2" style={{
            left: '15%',
            animation: 'moveVehicle 8s ease-in-out infinite'
          }}>
            <div className="relative">
              {/* Vehicle */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              {/* Vehicle Glow */}
              <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping"></div>
              {/* Direction Arrow */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-5 border-transparent border-b-blue-300"></div>
              {/* Speed Indicator */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-blue-300 font-mono bg-black/70 px-3 py-1 rounded-full">
                52 km/h
              </div>
            </div>
          </div>

          {/* Dynamic Route Path */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
            <div className="h-1 bg-blue-500/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
              <div className="absolute left-0 w-1/3 h-full bg-gradient-to-r from-blue-600 to-blue-400 animate-pulse"></div>
            </div>
            {/* Route Progress Indicator */}
            <div className="absolute left-[15%] top-1/2 transform -translate-y-1/2" style={{
              animation: 'moveVehicle 8s ease-in-out infinite'
            }}>
              <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>

          {/* Traffic Lights */}
          <div className="absolute top-[48%] left-[48%] w-2 h-6 bg-gray-800 rounded-sm">
            <div className="w-full h-2 bg-green-500 rounded-full animate-pulse mt-4"></div>
          </div>

          {/* Other Vehicles */}
          <div className="absolute top-[30%] left-[60%] w-4 h-4 rounded bg-gray-600 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-[70%] left-[80%] w-4 h-4 rounded bg-gray-600 animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Buildings/POIs */}
          <div className="absolute top-[20%] left-[20%] w-8 h-8 bg-slate-600 rounded opacity-60"></div>
          <div className="absolute top-[15%] left-[60%] w-6 h-6 bg-slate-600 rounded opacity-60"></div>
          <div className="absolute top-[80%] left-[30%] w-10 h-6 bg-slate-600 rounded opacity-60"></div>
          <div className="absolute top-[85%] left-[70%] w-8 h-8 bg-slate-600 rounded opacity-60"></div>
        </div>

        {/* Bottom Navigation Panel */}
        <div className="glass-card p-4 border-0 rounded-b-xl border-t border-white/10">
          {/* Route Info */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Demo Route</span>
              <span className="text-xs text-green-400">2.3 km remaining</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>ETA: 5 min</span>
              <span>•</span>
              <span>Via Main Street</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="glass" size="sm" className="text-blue-400 border-blue-500/20 hover:bg-blue-500/10">
              <Compass className="mr-2 h-3 w-3" />
              Recenter
            </Button>
            <Button variant="glass" size="sm" className="text-orange-400 border-orange-500/20 hover:bg-orange-500/10">
              <RotateCcw className="mr-2 h-3 w-3" />
              New Route
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 