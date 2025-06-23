import { Switch } from "@/components/ui/switch"

interface ToggleControlsProps {
  testTrackMode: boolean
  loggingMode: boolean
  onTestTrackToggle: (checked: boolean) => void
  onLoggingToggle: (checked: boolean) => void
}

export function ToggleControls({ 
  testTrackMode, 
  loggingMode, 
  onTestTrackToggle, 
  onLoggingToggle 
}: ToggleControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* TestTrack Mode Toggle */}
      <div className="glass-card p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium">TestTrack</span>
            <span className="text-xs text-gray-400">Scenario Mode</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="testtrack-mode"
              checked={testTrackMode}
              onCheckedChange={onTestTrackToggle}
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Logging Mode Toggle */}
      <div className="glass-card p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Logging</span>
            <span className="text-xs text-gray-400">Debug Mode</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="logging-mode"
              checked={loggingMode}
              onCheckedChange={onLoggingToggle}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 