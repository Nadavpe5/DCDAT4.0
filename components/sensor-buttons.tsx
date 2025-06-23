import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CheckCircle, CircleSlash } from "lucide-react"

interface SensorButtonsProps {
  insActive: boolean
  velodyneActive: boolean
  onInsToggle: (active: boolean) => void
  onVelodyneToggle: (active: boolean) => void
  disabled?: boolean
}

export function SensorButtons({
  insActive,
  velodyneActive,
  onInsToggle,
  onVelodyneToggle,
  disabled = false
}: SensorButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "flex-1 h-10 transition-all duration-300 border",
          insActive 
            ? "bg-slate-800/60 border-green-700/50 text-green-400" 
            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300"
        )}
        onClick={() => !disabled && onInsToggle(!insActive)}
        disabled={disabled}
      >
        <div className="flex items-center justify-center gap-1.5">
          {insActive ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>INS</span>
              <CheckCircle className="ml-1 w-3.5 h-3.5 text-green-500" />
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <span>INS</span>
              <CircleSlash className="ml-1 w-3.5 h-3.5 text-slate-600" />
            </>
          )}
        </div>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "flex-1 h-10 transition-all duration-300 border",
          velodyneActive 
            ? "bg-slate-800/60 border-green-700/50 text-green-400" 
            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300"
        )}
        onClick={() => !disabled && onVelodyneToggle(!velodyneActive)}
        disabled={disabled}
      >
        <div className="flex items-center justify-center gap-1.5">
          {velodyneActive ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Velodyne</span>
              <CheckCircle className="ml-1 w-3.5 h-3.5 text-green-500" />
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <span>Velodyne</span>
              <CircleSlash className="ml-1 w-3.5 h-3.5 text-slate-600" />
            </>
          )}
        </div>
      </Button>
    </div>
  )
} 