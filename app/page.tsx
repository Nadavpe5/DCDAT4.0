"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  AlertCircle,
  Car,
  CheckCircle,
  ChevronDown,
  Compass,
  Cpu,
  Database,
  Edit,
  HardDrive,
  Map,
  Minus,
  Network,
  Plus,
  Save,
  UploadCloud,
  X,
  Check,
  Camera,
  Radio,
  RotateCcw,
  FileCheck2,
  HardDriveDownload,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type React from "react"

// Sample data for drivers
const drivers = [
  { id: "1", name: "Daniel Levi", available: true, permissions: ["highway", "urban"] },
  { id: "2", name: "Evyatar Amiel", available: true, permissions: ["highway", "urban", "testtrack"] },
  { id: "3", name: "Nachum Gabi", available: true, permissions: ["highway", "urban", "testtrack"] },
  { id: "4", name: "Nadav Perez", available: false, permissions: ["highway"] },
].sort((a, b) => a.name.localeCompare(b.name))

// Sample data for existing subtasks
const existingSubtasks = [
  {
    id: "1",
    summary: "Highway Lane Change",
    type: "Driving",
    amountNeeded: 10,
    requestedEvents: "Lane changes on highway with moderate traffic",
    metadata: {
      weather: "Clear",
      timeOfDay: "Daylight",
      country: "Israel",
      extraInfo: "Focus on smooth transitions",
      coPilot: null,
    },
  },
  {
    id: "2",
    summary: "Urban Intersection",
    type: "Driving",
    amountNeeded: 15,
    requestedEvents: "Navigate busy intersections with pedestrians",
    metadata: {
      weather: "Cloudy",
      timeOfDay: "Daylight",
      country: "Israel",
      extraInfo: "Include left and right turns",
      coPilot: "Evyatar Amiel",
    },
  },
  {
    id: "3",
    summary: "Parking Lot Navigation",
    type: "Parking",
    amountNeeded: 8,
    requestedEvents: "Parallel and perpendicular parking scenarios",
    metadata: {
      weather: "Clear",
      timeOfDay: "Evening",
      country: "Israel",
      extraInfo: "Include tight spaces",
      coPilot: null,
    },
  },
  {
    id: "4",
    summary: "Cut-in Scenario",
    type: "Scenario",
    amountNeeded: 20,
    requestedEvents: "Vehicle cuts in front at varying distances",
    metadata: {
      weather: "Clear",
      timeOfDay: "Daylight",
      country: "Israel",
      extraInfo: "Maintain constant speed",
      coPilot: null,
    },
  },
  {
    id: "5",
    summary: "Emergency Brake Scenario",
    type: "Scenario",
    amountNeeded: 15,
    requestedEvents: "Lead vehicle performs emergency brake",
    metadata: {
      weather: "Clear",
      timeOfDay: "Daylight",
      country: "Israel",
      extraInfo: "Various initial distances",
      coPilot: null,
    },
  }
]

// Sample data for completed sessions
const completedSessions = [
  {
    id: "1",
    name: "Morning Drive #1",
    subtask: "Highway Lane Change",
    driver: "Nachum Gabi",
    date: "2025-05-20",
    duration: "00:32:15",
    metadata: {
      weather: "Clear",
      illumination: "Daylight",
      roadType: "Highway",
      location: "Route 101",
      country: "Israel",
      extraInfo: "Smooth traffic conditions",
      coPilot: null,
    },
    isTestTrack: true,
    ttFields: {
      scenario: "Lane Change",
      regulations: "ISO 26262",
      technology: "ADAS",
      overlap: "50%",
      targetSpeed: 80,
      vutSpeed: 75,
    },
    ttFieldsComplete: false,
  },
  {
    id: "2",
    name: "Urban Drive #3",
    subtask: "Urban Intersection",
    driver: "Evyatar Amiel",
    date: "2025-05-20",
    duration: "00:45:30",
    metadata: {
      weather: "Cloudy",
      illumination: "Daylight",
      roadType: "Urban",
      location: "Downtown",
      country: "Israel",
      extraInfo: "Heavy pedestrian traffic",
      coPilot: "Daniel Levi",
    },
    isTestTrack: false,
    ttFields: null,
    ttFieldsComplete: true,
  },
  {
    id: "3",
    name: "Parking Test #2",
    subtask: "Parking Lot Navigation",
    driver: "Daniel Levi",
    date: "2025-05-20",
    duration: "00:15:45",
    metadata: {
      weather: "Rainy",
      illumination: "Evening",
      roadType: "Parking",
      location: "Mall Parking",
      country: "Israel",
      extraInfo: "Limited visibility conditions",
      coPilot: null,
    },
    isTestTrack: false,
    ttFields: null,
    ttFieldsComplete: true,
  },
]

export default function Dashboard() {
  // Main app states
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [insChecked, setInsChecked] = useState(true)
  const [velodyneChecked, setVelodyneChecked] = useState(true)
  const [testTrackMode, setTestTrackMode] = useState(false)
  const [time, setTime] = useState("00:00:00")
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)

  // Validation states
  const [gpsValid, setGpsValid] = useState(true)
  const [signalsValid, setSignalsValid] = useState(true)
  const [gtDataValid, setGtDataValid] = useState(false)
  const [framesValid, setFramesValid] = useState(true)
  const [radarsValid, setRadarsValid] = useState(true)

  // TestTrack session states
  const [ttSessionModalOpen, setTtSessionModalOpen] = useState(false)
  const [ttSessionActive, setTtSessionActive] = useState(false)
  const [ttScenarioActive, setTtScenarioActive] = useState(false)
  const [ttValidScenario, setTtValidScenario] = useState(false)
  const [ttCollectedScenarios, setTtCollectedScenarios] = useState(12)
  const [ttTotalScenarios, setTtTotalScenarios] = useState(20)

  // CAR2DB Flow states
  const [currentStep, setCurrentStep] = useState(0)
  const [driverPickerOpen, setDriverPickerOpen] = useState(false)
  const [subtaskSelectorOpen, setSubtaskSelectorOpen] = useState(false)
  const [driveSummaryOpen, setDriveSummaryOpen] = useState(false)
  const [rerunModalOpen, setRerunModalOpen] = useState(false)
  const [isParallelTasks, setIsParallelTasks] = useState(false)

  // Driver selection states
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
  const [driverSearchOpen, setDriverSearchOpen] = useState(false)
  const [driverSearch, setDriverSearch] = useState("")

  // Subtask states
  const [useExistingSubtask, setUseExistingSubtask] = useState(true)
  const [selectedSubtask, setSelectedSubtask] = useState("")
  const [subtaskSummary, setSubtaskSummary] = useState("")
  const [subtaskDescription, setSubtaskDescription] = useState("")
  const [subtaskType, setSubtaskType] = useState("")
  const [subtaskAmountNeeded, setSubtaskAmountNeeded] = useState(1)
  const [subtaskRequestedEvents, setSubtaskRequestedEvents] = useState("")

  // TestTrack fields
  const [subtaskScenario, setSubtaskScenario] = useState("")
  const [subtaskRegulations, setSubtaskRegulations] = useState("")
  const [subtaskTechnology, setSubtaskTechnology] = useState("")
  const [subtaskOverlap, setSubtaskOverlap] = useState("")
  const [subtaskTargetSpeed, setSubtaskTargetSpeed] = useState(0)
  const [subtaskVutSpeed, setSubtaskVutSpeed] = useState(0)

  // Drive summary states
  const [driveWeather, setDriveWeather] = useState("")
  const [driveTimeOfDay, setDriveTimeOfDay] = useState("")
  const [driveCountry, setDriveCountry] = useState("Israel")
  const [driveExtraInfo, setDriveExtraInfo] = useState("")
  const [driveCoPilot, setDriveCoPilot] = useState<string | null>(null)

  // Uploader modal states
  const [uploaderModalOpen, setUploaderModalOpen] = useState(false)
  const [sessionApprovals, setSessionApprovals] = useState<Record<string, boolean>>({})
  const [editingSession, setEditingSession] = useState<string | null>(null)
  const [uploadInProgress, setUploadInProgress] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  interface SessionMetadata {
    weather: string;
    illumination: string;
    roadType: string;
    location: string;
    country: string;
    extraInfo: string;
    coPilot: string | null;
  }
  
  interface Session {
    id: string;
    name: string;
    subtask: string;
    driver: string;
    date: string;
    duration: string;
    metadata: SessionMetadata;
    isTestTrack: boolean;
    ttFields: {
      scenario: string;
      regulations: string;
      technology: string;
      overlap: string;
      targetSpeed: number;
      vutSpeed: number;
    } | null;
    ttFieldsComplete: boolean;
  }
  
  const [sessionData, setSessionData] = useState<Session[]>(completedSessions)

  // Metadata editing states
  const [editWeather, setEditWeather] = useState("")
  const [editIllumination, setEditIllumination] = useState("")
  const [editRoadType, setEditRoadType] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editCountry, setEditCountry] = useState("")
  const [editExtraInfo, setEditExtraInfo] = useState("")
  const [editCoPilot, setEditCoPilot] = useState<string | null>(null)

  // Filter drivers based on search and availability
  const filteredDrivers = drivers
    .filter((driver) => driver.available)
    .filter((driver) => driver.name.toLowerCase().includes(driverSearch.toLowerCase()))
    .filter((driver) => !testTrackMode || driver.permissions.includes("testtrack"))

  // Filter subtasks based on TestTrack mode
  const filteredSubtasks = existingSubtasks.filter(
    subtask => !testTrackMode || subtask.type === "Scenario"
  )

  // Timer functionality
  useEffect(() => {
    if (isRecording && !timerInterval) {
      const now = new Date()
      setStartTime(now)
      const interval = setInterval(() => {
        const elapsed = new Date().getTime() - now.getTime()
        const hours = Math.floor(elapsed / 3600000)
          .toString()
          .padStart(2, "0")
        const minutes = Math.floor((elapsed % 3600000) / 60000)
          .toString()
          .padStart(2, "0")
        const seconds = Math.floor((elapsed % 60000) / 1000)
          .toString()
          .padStart(2, "0")
        setTime(`${hours}:${minutes}:${seconds}`)
      }, 1000)
      setTimerInterval(interval)
    } else if (!isRecording && timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [isRecording, timerInterval])

   // 🧠 NEW: Auto-stop long sessions (MAX 1.5h)
  useEffect(() => {
    if (isRecording && startTime) {
      const warnTimer = setTimeout(() => {
        toast({
          title: "Max Session Approaching",
          description: "Session will end automatically in 5 minutes.",
          variant: "default"
        });
      }, 85 * 60 * 1000);
      const stopTimer = setTimeout(() => {
        setIsRecording(false);
        setDriveSummaryOpen(true);
        toast({
          title: "Session Auto-Stopped",
          description: "1.5 hour session limit reached.",
          variant: "destructive"
        });
      }, 90 * 60 * 1000);
      return () => {
        clearTimeout(warnTimer);
        clearTimeout(stopTimer);
      };
    }
  }, [isRecording, startTime])

  // Start the CAR2DB flow
  const startRecordingFlow = () => {
    setCurrentStep(1)
    setDriverPickerOpen(true)
  }

  // Handle driver selection
  const handleDriverSelected = () => {
    setDriverPickerOpen(false)
    setCurrentStep(2)
    setSubtaskSelectorOpen(true)
  }

  // Handle subtask completion
  const handleSubtaskComplete = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Subtask values:", {
      existingSubtask: selectedSubtask,
      summary: subtaskSummary,
      description: subtaskDescription,
      type: subtaskType,
      amountNeeded: subtaskAmountNeeded,
      requestedEvents: subtaskRequestedEvents,
      scenario: subtaskScenario,
      regulations: subtaskRegulations,
      technology: subtaskTechnology,
      overlap: subtaskOverlap,
      targetSpeed: subtaskTargetSpeed,
      vutSpeed: subtaskVutSpeed,
    })

    setSubtaskSelectorOpen(false)
    setCurrentStep(3)
    
    if (testTrackMode) {
      setTtSessionModalOpen(true);
    } else {
      setIsRecording(true)
      setHasRecorded(true) // Add flag when starting normal recording
    }
  }

  // Handle drive summary submission
  const handleDriveSummaryComplete = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Drive summary:", {
      weather: driveWeather,
      timeOfDay: driveTimeOfDay,
      country: driveCountry,
      extraInfo: driveExtraInfo,
      coPilot: driveCoPilot,
    })

    setDriveSummaryOpen(false)
    setCurrentStep(6)
  }

  // Handle rerun decision
  const handleRerunDecision = (reuse: boolean) => {
    setRerunModalOpen(false)

    if (reuse) {
      // Reuse previous settings
      const subtask = existingSubtasks.find((s) => s.id === selectedSubtask)
      if (subtask) {
        setDriveWeather(subtask.metadata.weather)
        setDriveTimeOfDay(subtask.metadata.timeOfDay)
        setDriveCountry(subtask.metadata.country)
        setDriveExtraInfo(subtask.metadata.extraInfo)
        setDriveCoPilot(subtask.metadata.coPilot)
      }
      setIsRecording(true)
      setCurrentStep(3)
    } else {
      // Start fresh
      startRecordingFlow()
    }
  }

  // TestTrack session management
  const startTtSession = () => {
    setTtSessionActive(true)
    sendMqttEvent("session_start")
    toast({
      title: "TestTrack Session Started",
      description: "Session is now active",
    })
  }

  const stopTtSession = () => {
    if (ttValidScenario && startTime) {
      const elapsed = new Date().getTime() - startTime.getTime();
      if (elapsed < 5 * 60 * 1000) {
        toast({
          title: "Session Too Short",
          description: "At least 5 minutes required for valid repetitions.",
          variant: "destructive"
        });
        return;
      }

      // Save valid scenario data
      const durationSec = elapsed / 1000;
      const summary = {
        scenario: subtaskScenario,
        timestamp: startTime.toISOString(),
        valid: true,
        duration: durationSec,
        regulations: subtaskRegulations,
        technology: subtaskTechnology,
        overlap: subtaskOverlap,
        targetSpeed: subtaskTargetSpeed,
        vutSpeed: subtaskVutSpeed
      };
      const existing = JSON.parse(localStorage.getItem("tt-valid-reps") || "[]");
      existing.push(summary);
      localStorage.setItem("tt-valid-reps", JSON.stringify(existing));
    }

    if (!ttValidScenario) {
      const invalidRep = {
        timestamp: new Date().toISOString(),
        scenario: subtaskScenario,
        status: "invalid"
      };
      const existingReps = JSON.parse(localStorage.getItem('tt-invalid-reps') || '[]');
      existingReps.push(invalidRep);
      localStorage.setItem('tt-invalid-reps', JSON.stringify(existingReps));
    }

    // Reset all TT session state and trigger summary
    setTtSessionModalOpen(false);
    setTtSessionActive(false);
    setTtScenarioActive(false);
    setIsRecording(false);
    setDriveSummaryOpen(true);
    setSelectedSubtask("");
    setStartTime(null);

    sendMqttEvent("session_stop");

    toast({
      title: "TestTrack Session Stopped",
      description: "Session has been ended",
    });
};


  const startTtScenario = () => {
    setTtScenarioActive(true)
    sendMqttEvent("scenario_start")
    toast({
      title: "Scenario Started",
      description: "Recording scenario data",
    })
  }

  const stopTtScenario = () => {
    setTtScenarioActive(false)
    sendMqttEvent("scenario_stop")

    if (ttValidScenario) {
      setTtCollectedScenarios((prev) => Math.min(prev + 1, ttTotalScenarios))
      toast({
        title: "Valid Scenario Collected",
        description: `${ttCollectedScenarios + 1}/${ttTotalScenarios} scenarios collected`,
      })
    } else {
      toast({
        title: "Scenario Stopped",
        description: "Scenario marked as invalid",
      })
    }
  }

  const sendMqttEvent = (event: string) => {
    // Simulate sending MQTT event
    console.log(`Sending MQTT event to TT/session/event: ${event}`)
    // In a real implementation, you would use an MQTT client library
    // mqttClient.publish('TT/session/event', JSON.stringify({ event, timestamp: new Date().toISOString() }))
  }

  // Toggle recording state
  const toggleRecording = async () => {
    if (testTrackMode) {
      if (!selectedSubtask) {
        setSelectedDriver("tt-driver")
        setSubtaskSelectorOpen(true)
        return
      }

      if (!isRecording) {
        // Start recording + session
        setTtSessionActive(true)
        setTtScenarioActive(false) // Reset scenario state
        setTtValidScenario(false)
        sendMqttEvent("session_start")
      } else {
        // Stop recording + session
        setTtSessionActive(false)
        setTtScenarioActive(false)
        sendMqttEvent("session_stop")
      }
      setIsRecording(!isRecording)
      setHasRecorded(true)
      setStartTime(!isRecording ? new Date() : null)

      toast({
        title: !isRecording ? "TestTrack Session Started" : "TestTrack Session Stopped",
        description: !isRecording ? "Ready to record scenarios" : "Session ended",
      })

      return
    }

    // Example: Fetch disk usage from backend or placeholder
    const diskUsage = 85; // Replace with real API call
    if (diskUsage >= 90) {
      toast({
        title: "Disk Full",
        description: "Recording is blocked due to >90% disk usage.",
        variant: "destructive"
      });
      return;
    } else if (diskUsage >= 80) {
      toast({
        title: "High Disk Usage",
        description: "Disk usage is above 80%. Consider clearing space.",
        variant: "default"
      });
    }
    if (isRecording) {
      setIsRecording(false)
      setCurrentStep(5)

      // Pre-fill drive summary if we have a selected subtask
      if (selectedSubtask) {
        const subtask = existingSubtasks.find((s) => s.id === selectedSubtask)
        if (subtask) {
          setDriveWeather(subtask.metadata.weather)
          setDriveTimeOfDay(subtask.metadata.timeOfDay)
          setDriveCountry(subtask.metadata.country)
          setDriveExtraInfo(subtask.metadata.extraInfo)
          setDriveCoPilot(subtask.metadata.coPilot)
        }
      }

      // Open drive summary modal
      setDriveSummaryOpen(true)
    } else {
      if (testTrackMode && !ttSessionActive) {
        setTtSessionModalOpen(true)
      } else {
        // Check if this is a rerun of an existing subtask
        if (selectedSubtask) {
          setRerunModalOpen(true)
        } else {
          startRecordingFlow()
        }
      }
    }
  }

  // Session approval management
  const toggleSessionApproval = (sessionId: string) => {
    setSessionApprovals((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }))
  }

  // Session metadata editing
  const startEditingSession = (sessionId: string) => {
    const session = sessionData.find((s) => s.id === sessionId)
    if (session) {
      setEditWeather(session.metadata.weather || "")
      setEditIllumination(session.metadata.illumination || "")
      setEditRoadType(session.metadata.roadType || "")
      setEditLocation(session.metadata.location || "")
      setEditCountry(session.metadata.country || "")
      setEditExtraInfo(session.metadata.extraInfo || "")
      setEditCoPilot(session.metadata.coPilot)
      setEditingSession(sessionId)
    }
  }

  // Save edited session metadata
  const saveSessionMetadata = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingSession) return

    setSessionData((prev) =>
      prev.map((session) => {
        if (session.id === editingSession) {
          return {
            ...session,
            metadata: {
              ...session.metadata,
              weather: editWeather,
              illumination: editIllumination,
              roadType: editRoadType,
              location: editLocation,
              country: editCountry,
              extraInfo: editExtraInfo,
              coPilot: editCoPilot,
            },
          }
        }
        return session
      }),
    )

    setEditingSession(null)
    toast({
      title: "Metadata Updated",
      description: "Session metadata has been updated successfully",
    })
  }

  // Upload approved sessions
  const uploadSessions = () => {
    const approvedSessions = Object.entries(sessionApprovals)
      .filter(([_, approved]) => approved)
      .map(([id]) => id)

    if (approvedSessions.length === 0) return

    setUploadInProgress(true)

    // Simulate upload process
    setTimeout(() => {
      setUploadInProgress(false)
      setUploadComplete(true)

      // Clear TT repetitions after successful upload
      localStorage.removeItem("tt-valid-reps");
      localStorage.removeItem("tt-invalid-reps");
      setValidTTReps(0);
      setInvalidTTReps(0);

      toast({
        title: "Upload Complete",
        description: `${approvedSessions.length} sessions uploaded successfully`,
      })

      // Reset after showing completion message
      setTimeout(() => {
        setUploadComplete(false)
        setUploaderModalOpen(false)
        setSessionApprovals({})
        setCurrentStep(7) // Move to final step
      }, 3000)
    }, 2000)
  }

  const anySessionApproved = Object.values(sessionApprovals).some((approved) => approved)

  // UI Components
  const SystemStatusIndicator = ({ name, isActive = true }: { name: string; isActive?: boolean }) => (
    <div className="flex items-center gap-1.5">
      <div className={cn("w-2.5 h-2.5 rounded-full", isActive ? "bg-green-500" : "bg-red-500")} />
      <span className="text-xs text-gray-300">{name}</span>
    </div>
  )

  const ResourceBar = ({ name, value, icon }: { name: string; value: number; icon: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-xs text-gray-400">{name}</span>
        </div>
        <span className="text-xs text-gray-400">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  )

  const ValidationItem = ({
    name,
    isValid = true,
    icon,
  }: { name: string; isValid?: boolean; icon?: React.ReactNode }) => (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-xl transition-colors",
        isValid ? "bg-slate-800 border-l-4 border-green-500" : "bg-slate-800 border-l-4 border-red-500",
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div
        className={cn(
          "flex items-center justify-center w-8 h-4 rounded-full",
          isValid ? "bg-green-500/20" : "bg-red-500/20",
        )}
      >
        {isValid ? <CheckCircle className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
      </div>
    </div>
  )

  // 🧠 Load TT repetitions from localStorage only on the client
  const [validTTReps, setValidTTReps] = useState<number>(0);
  const [invalidTTReps, setInvalidTTReps] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const valid = JSON.parse(localStorage.getItem("tt-valid-reps") || "[]");
      const invalid = JSON.parse(localStorage.getItem("tt-invalid-reps") || "[]");
      setValidTTReps(valid.length);
      setInvalidTTReps(invalid.length);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white max-w-md mx-auto">
      {/* Top Bar */}
      <header className="bg-slate-800 p-4 border-b border-slate-700 shadow-md rounded-b-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-[40px] w-[120px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20white-2jJx8ENUtxYrfB2ByeJwe5S0DTajSr.png"
                alt="Mobileye Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <h1 className="text-lg font-bold whitespace-nowrap">DC DAT 4.0</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-300">TestTrack Mode</span>
            <Switch
              checked={testTrackMode}
              onCheckedChange={setTestTrackMode}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 justify-between">
            <SystemStatusIndicator name="Orchestrator" />
            <SystemStatusIndicator name="Ruler" />
            <SystemStatusIndicator name="Logger" />
            <SystemStatusIndicator name="MQTT" />
            <SystemStatusIndicator name="GTLogging" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ResourceBar name="CPU" value={12} icon={<Cpu className="h-3 w-3 text-gray-400" />} />
            <ResourceBar name="Memory" value={34} icon={<Database className="h-3 w-3 text-gray-400" />} />
            <ResourceBar name="Disk" value={56} icon={<HardDrive className="h-3 w-3 text-gray-400" />} />
            <ResourceBar name="Network" value={23} icon={<Network className="h-3 w-3 text-gray-400" />} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 flex flex-col gap-4">
        {/* AVD Mini Map */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">AVD Mini Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 rounded-xl overflow-hidden bg-blue-900">
              {/* Zoom controls */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg bg-slate-800/70 border-slate-600">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg bg-slate-800/70 border-slate-600">
                  <Minus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Compass */}
              <div className="absolute top-2 right-12 bg-slate-800/70 p-1 rounded-full border border-slate-600">
                <Compass className="h-5 w-5 text-white" />
              </div>

              {/* Car icon with location rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* Location rings */}
                <div className="w-28 h-28 rounded-full border border-white/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-16 h-16 rounded-full border border-white/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-8 h-8 rounded-full border border-white/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

                {/* Car icon */}
                <div className="bg-blue-500 p-1 rounded-full">
                  <Car className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className="w-full mt-3 justify-center py-1.5 text-sm font-medium bg-green-900/20 text-green-400 border-green-800 rounded-lg"
            >
              Localized: Yes
            </Badge>

            <Button variant="outline" className="w-full mt-3 rounded-xl">
              <Map className="mr-2 h-4 w-4" />
              Mini Map
            </Button>
          </CardContent>
        </Card>

        {/* Session Control */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Session Control</CardTitle>
            {selectedDriver && selectedSubtask && (
              <CardDescription className="text-xs text-gray-400">
                Driver: {drivers.find((d) => d.id === selectedDriver)?.name} • Subtask:{" "}
                {existingSubtasks.find((s) => s.id === selectedSubtask)?.summary || subtaskSummary}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-4xl font-mono font-bold my-4">{time}</div>

            <Button
              className={cn(
                "w-full py-5 text-base mb-4 rounded-xl",
                isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700",
              )}
              onClick={toggleRecording}
            >
              {isRecording ? (
                <>
                  <X className="mr-2 h-5 w-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Start Recording
                </>
              )}
            </Button>

            {hasRecorded && (
              <Button
                onClick={() => setUploaderModalOpen(true)}
                disabled={isRecording}
                className={cn(
                  "w-full mt-4 px-6 py-5 rounded-2xl text-white text-sm font-semibold shadow-lg transition-all",
                  isRecording
                    ? "bg-gradient-to-r from-slate-500 to-slate-600 opacity-60 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                )}
              >
                <FileCheck2 className="w-4 h-4 mr-2" />
                End Drive & Approve
              </Button>
            )}

            <div className="w-full space-y-3 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ins"
                  checked={insChecked}
                  onCheckedChange={(checked) => !isRecording && setInsChecked(checked as boolean)}
                  disabled={isRecording}
                  className={isRecording ? "opacity-60" : ""}
                />
                <label
                  htmlFor="ins"
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed",
                    isRecording ? "opacity-60" : "",
                  )}
                >
                  INS
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="velodyne"
                  checked={velodyneChecked}
                  onCheckedChange={(checked) => !isRecording && setVelodyneChecked(checked as boolean)}
                  disabled={isRecording}
                  className={isRecording ? "opacity-60" : ""}
                />
                <label
                  htmlFor="velodyne"
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed",
                    isRecording ? "opacity-60" : "",
                  )}
                >
                  Velodyne
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validations */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Validations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <ValidationItem name="GPS" isValid={gpsValid} />
              <ValidationItem name="Signals" isValid={signalsValid} />
              <ValidationItem name="GTData" isValid={gtDataValid} />
              <ValidationItem name="Frames" isValid={framesValid} icon={<Camera className="h-4 w-4 text-gray-400" />} />
              <ValidationItem name="Radars" isValid={radarsValid} icon={<Radio className="h-4 w-4 text-gray-400" />} />
            </div>
            {testTrackMode && (validTTReps > 0 || invalidTTReps > 0) && (
              <>
                <div className="flex items-center justify-between px-3 text-sm text-green-400">
                  <Check className="h-3 w-3 mr-1" />
                  {validTTReps} valid repetitions
                </div>
                <div className="flex items-center justify-between px-3 text-sm text-red-400">
                  <X className="h-3 w-3 mr-1" />
                  {invalidTTReps} invalid repetitions
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Driver Picker Modal (Step 1) */}
      <Dialog open={driverPickerOpen} onOpenChange={setDriverPickerOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Driver</DialogTitle>
            <DialogDescription>Choose a driver for this recording session</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Popover open={driverSearchOpen} onOpenChange={setDriverSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={driverSearchOpen}
                  className="w-full justify-between"
                >
                  {selectedDriver ? drivers.find((driver) => driver.id === selectedDriver)?.name : "Select driver..."}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search driver..."
                    className="h-9"
                    value={driverSearch}
                    onValueChange={setDriverSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No driver found.</CommandEmpty>
                    <CommandGroup>
                      {filteredDrivers.map((driver) => (
                        <CommandItem
                          key={driver.id}
                          value={driver.id}
                          onSelect={(currentValue) => {
                            setSelectedDriver(currentValue)
                            setDriverSearchOpen(false)
                          }}
                        >
                          {driver.name}
                          <CheckCircle
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedDriver === driver.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button type="button" className="w-full" disabled={!selectedDriver} onClick={handleDriverSelected}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subtask Selector Modal (Step 2) */}
      <Dialog open={subtaskSelectorOpen} onOpenChange={setSubtaskSelectorOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Subtask</DialogTitle>
            <DialogDescription>Select an existing subtask or create a new one</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="useExisting"
                checked={useExistingSubtask}
                onCheckedChange={(checked) => setUseExistingSubtask(checked as boolean)}
              />
              <label htmlFor="useExisting" className="text-sm font-medium leading-none">
                Use existing subtask
              </label>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="parallelTasks"
                checked={isParallelTasks}
                onCheckedChange={(checked) => setIsParallelTasks(checked as boolean)}
              />
              <label htmlFor="parallelTasks" className="text-sm font-medium leading-none">
                Allow parallel tasks
              </label>
            </div>

            <form onSubmit={handleSubtaskComplete} className="space-y-4">
              {useExistingSubtask ? (
                <div>
                  <label className="text-sm font-medium mb-2 block">Subtask</label>
                  <Select value={selectedSubtask} onValueChange={setSelectedSubtask}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subtask" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubtasks.map((subtask) => (
                        <SelectItem key={subtask.id} value={subtask.id}>
                          {subtask.summary} ({subtask.type}, {subtask.amountNeeded} needed)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedSubtask && (
                    <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Requested Events:</h4>
                      <p className="text-xs text-gray-300">
                        {existingSubtasks.find((s) => s.id === selectedSubtask)?.requestedEvents ||
                          "No specific events requested"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Summary</label>
                    <Input
                      placeholder="Brief summary"
                      value={subtaskSummary}
                      onChange={(e) => setSubtaskSummary(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Description</label>
                    <Textarea
                      placeholder="Detailed description (min 30 characters)"
                      className="min-h-[100px]"
                      value={subtaskDescription}
                      onChange={(e) => setSubtaskDescription(e.target.value)}
                      required
                      minLength={30}
                    />
                    <p className="text-xs text-gray-400">Minimum 30 characters required</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Requested Events</label>
                    <Textarea
                      placeholder="Specific events to capture during this subtask"
                      className="min-h-[80px]"
                      value={subtaskRequestedEvents}
                      onChange={(e) => setSubtaskRequestedEvents(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Type</label>
                    <Select value={subtaskType} onValueChange={setSubtaskType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Driving">Driving</SelectItem>
                        <SelectItem value="Parking">Parking</SelectItem>
                        <SelectItem value="Highway">Highway</SelectItem>
                        <SelectItem value="Urban">Urban</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Amount Needed</label>
                    <Input
                      type="number"
                      min={1}
                      value={subtaskAmountNeeded}
                      onChange={(e) => setSubtaskAmountNeeded(Number.parseInt(e.target.value))}
                    />
                  </div>

                  {testTrackMode && (
                    <div className="space-y-4 pt-4 border-t border-slate-700">
                      <h3 className="text-sm font-medium">TestTrack Mode Fields</h3>

                      <div className="space-y-2">
                        <label className="text-sm font-medium block">Scenario</label>
                        <Input
                          placeholder="Test scenario"
                          value={subtaskScenario}
                          onChange={(e) => setSubtaskScenario(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium block">Regulations</label>
                        <Input
                          placeholder="Applicable regulations"
                          value={subtaskRegulations}
                          onChange={(e) => setSubtaskRegulations(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium block">Technology</label>
                        <Input
                          placeholder="Technology used"
                          value={subtaskTechnology}
                          onChange={(e) => setSubtaskTechnology(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium block">Overlap</label>
                        <Input
                          placeholder="Overlap percentage"
                          value={subtaskOverlap}
                          onChange={(e) => setSubtaskOverlap(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium block">Target Speed (km/h)</label>
                          <Input
                            type="number"
                            min={0}
                            value={subtaskTargetSpeed}
                            onChange={(e) => setSubtaskTargetSpeed(Number.parseInt(e.target.value))}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium block">VUT Speed (km/h)</label>
                          <Input
                            type="number"
                            min={0}
                            value={subtaskVutSpeed}
                            onChange={(e) => setSubtaskVutSpeed(Number.parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="sticky bottom-0 pt-4 bg-background">
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drive Summary Modal (Step 5) */}
      <Dialog open={driveSummaryOpen} onOpenChange={setDriveSummaryOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Drive Summary</DialogTitle>
            <DialogDescription>Add details about the completed drive</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <form onSubmit={handleDriveSummaryComplete} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium block">Weather</label>
                <Select value={driveWeather} onValueChange={setDriveWeather} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clear">Clear</SelectItem>
                    <SelectItem value="Cloudy">Cloudy</SelectItem>
                    <SelectItem value="Rainy">Rainy</SelectItem>
                    <SelectItem value="Snowy">Snowy</SelectItem>
                    <SelectItem value="Foggy">Foggy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">Time of Day</label>
                <Select value={driveTimeOfDay} onValueChange={setDriveTimeOfDay} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time of day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daylight">Daylight</SelectItem>
                    <SelectItem value="Dawn/Dusk">Dawn/Dusk</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">Country</label>
                <Input
                  placeholder="Country"
                  value={driveCountry}
                  onChange={(e) => setDriveCountry(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">Extra Information</label>
                <Textarea
                  placeholder="Additional details about the drive"
                  className="min-h-[80px]"
                  value={driveExtraInfo}
                  onChange={(e) => setDriveExtraInfo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">Co-Pilot (Optional)</label>
                <Select
                  value={driveCoPilot || "none"}
                  onValueChange={(value) => setDriveCoPilot(value === "none" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select co-pilot (if any)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sticky bottom-0 pt-4 bg-background">
                <Button type="submit" className="w-full">
                  Finalize Session
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rerun Modal (Step 7) */}
      <Dialog open={rerunModalOpen} onOpenChange={setRerunModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Continue Previous Session?</DialogTitle>
            <DialogDescription>You're starting another session for the same subtask</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="p-3 bg-slate-700/30 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Current Subtask:</h4>
              <p className="text-sm">
                {existingSubtasks.find((s) => s.id === selectedSubtask)?.summary || "Unknown Subtask"}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => handleRerunDecision(true)} className="bg-blue-600 hover:bg-blue-700">
                <RotateCcw className="mr-2 h-4 w-4" />
                Continue with Previous Settings
              </Button>

              <Button onClick={() => handleRerunDecision(false)} variant="outline">
                Start Fresh Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* TestTrack Session Modal */}
      <Dialog open={ttSessionModalOpen} onOpenChange={setTtSessionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>TestTrack Scenario Session</DialogTitle>
            <DialogDescription>Configure and control your TestTrack session</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="controls" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="space-y-4">
              <div className="flex flex-col gap-4">
                <Button
                  onClick={startTtScenario}
                  disabled={!isRecording || ttScenarioActive}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  Start Scenario
                </Button>

                <Button
                  onClick={stopTtScenario}
                  disabled={!isRecording || !ttScenarioActive}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                >
                  Stop Scenario
                </Button>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="validScenario"
                    checked={ttValidScenario}
                    onCheckedChange={(checked) => setTtValidScenario(checked as boolean)}
                    disabled={!ttSessionActive}
                  />
                  <label htmlFor="validScenario" className="text-sm font-medium leading-none">
                    Valid Scenario
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collected Scenarios:</span>
                    <span>
                      {ttCollectedScenarios} / {ttTotalScenarios}
                    </span>
                  </div>
                  <Progress value={(ttCollectedScenarios / ttTotalScenarios) * 100} className="h-2" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              {/* Valid Repetitions */}
              {typeof window !== "undefined" && (() => {
                const validTT = JSON.parse(localStorage.getItem("tt-valid-reps") || "[]");
                const invalidTT = JSON.parse(localStorage.getItem("tt-invalid-reps") || "[]");
                
                return (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Valid Repetitions ({validTT.length})
                      </h3>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {validTT.map((rep: any, i: number) => (
                          <div key={i} className="p-2 bg-slate-800 rounded-lg text-xs space-y-1">
                            <div className="flex justify-between text-gray-400">
                              <span>{new Date(rep.timestamp).toLocaleString()}</span>
                              <span>{Math.round(rep.duration)}s</span>
                            </div>
                            <div className="font-medium">{rep.scenario}</div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-400">
                              <div>Speed: {rep.targetSpeed}km/h</div>
                              <div>VUT: {rep.vutSpeed}km/h</div>
                              <div>Tech: {rep.technology}</div>
                              <div>Overlap: {rep.overlap}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <X className="h-4 w-4 text-red-500" />
                        Invalid Repetitions ({invalidTT.length})
                      </h3>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {invalidTT.map((rep: any, i: number) => (
                          <div key={i} className="p-2 bg-slate-800 rounded-lg text-xs">
                            <div className="flex justify-between text-gray-400">
                              <span>{new Date(rep.timestamp).toLocaleString()}</span>
                              <span>{rep.scenario}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </TabsContent>
          </Tabs>

          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setTtSessionModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Uploader Modal (Step 6) */}
      <Dialog open={uploaderModalOpen} onOpenChange={setUploaderModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          {uploadComplete ? (
            <>
              <DialogHeader>
                <DialogTitle>Session Review Complete</DialogTitle>
                <DialogDescription>All recorded sessions have been reviewed successfully.</DialogDescription>
              </DialogHeader>

              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <div className="bg-green-900/30 p-4 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-center">Review Complete</h3>
                <p className="text-center text-gray-400">
                  All sessions have been reviewed. The hard drive can now be removed.
                </p>
                <Alert className="bg-blue-900/30 border-blue-800 mt-4">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Next Steps</AlertTitle>
                  <AlertDescription className="text-blue-300">Insert HD at Copy Station</AlertDescription>
                </Alert>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Review Sessions for Copy Station</DialogTitle>
                <DialogDescription>
                  Confirm reviewed sessions before removing the hard disk.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                {sessionData.map((session) => (
                  <Card
                    key={session.id}
                    className={cn(
                      "bg-slate-800 border-slate-700 transition-all",
                      sessionApprovals[session.id] && "border-l-4 border-l-green-500",
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{session.name}</CardTitle>
                          <CardDescription>
                            {session.subtask} • {session.driver} • {session.duration}
                          </CardDescription>
                        </div>
                        {session.isTestTrack && !session.ttFieldsComplete && (
                          <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-800">
                            Incomplete TT Fields
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {editingSession === session.id ? (
                        <form
                          onSubmit={saveSessionMetadata}
                          className="space-y-3 border border-slate-700 p-3 rounded-lg"
                        >
                          <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-2">
                              <TabsTrigger value="basic">Basic Info</TabsTrigger>
                              <TabsTrigger value="advanced">Advanced</TabsTrigger>
                            </TabsList>
                            <TabsContent value="basic" className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <label className="text-xs font-medium block">Weather</label>
                                  <Select value={editWeather} onValueChange={setEditWeather}>
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Weather" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Clear">Clear</SelectItem>
                                      <SelectItem value="Cloudy">Cloudy</SelectItem>
                                      <SelectItem value="Rainy">Rainy</SelectItem>
                                      <SelectItem value="Snowy">Snowy</SelectItem>
                                      <SelectItem value="Foggy">Foggy</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs font-medium block">Illumination</label>
                                  <Select value={editIllumination} onValueChange={setEditIllumination}>
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Illumination" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Daylight">Daylight</SelectItem>
                                      <SelectItem value="Dawn/Dusk">Dawn/Dusk</SelectItem>
                                      <SelectItem value="Evening">Evening</SelectItem>
                                      <SelectItem value="Night">Night</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <label className="text-xs font-medium block">Road Type</label>
                                  <Select value={editRoadType} onValueChange={setEditRoadType}>
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Road Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Highway">Highway</SelectItem>
                                      <SelectItem value="Urban">Urban</SelectItem>
                                      <SelectItem value="Rural">Rural</SelectItem>
                                      <SelectItem value="Parking">Parking</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs font-medium block">Location</label>
                                  <Input
                                    className="h-8"
                                    placeholder="Location"
                                    value={editLocation}
                                    onChange={(e) => setEditLocation(e.target.value)}
                                  />
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="advanced" className="space-y-3">
                              <div className="space-y-2">
                                <label className="text-xs font-medium block">Country</label>
                                <Input
                                  className="h-8"
                                  placeholder="Country"
                                  value={editCountry}
                                  onChange={(e) => setEditCountry(e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-medium block">Extra Information</label>
                                <Textarea
                                  className="min-h-[60px]"
                                  placeholder="Additional details"
                                  value={editExtraInfo}
                                  onChange={(e) => setEditExtraInfo(e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-medium block">Co-Pilot</label>
                                <Select
                                  value={editCoPilot || "none"}
                                  onValueChange={(value) => setEditCoPilot(value === "none" ? null : value)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Co-Pilot (if any)" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {drivers.map((driver) => (
                                      <SelectItem key={driver.id} value={driver.id}>
                                        {driver.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </TabsContent>
                          </Tabs>

                          <div className="flex justify-end pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() => setEditingSession(null)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" size="sm">
                              <Save className="h-3.5 w-3.5 mr-1" />
                              Save
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Weather:</span>
                            <span>{session.metadata.weather}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Illumination:</span>
                            <span>{session.metadata.illumination}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Road Type:</span>
                            <span>{session.metadata.roadType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Location:</span>
                            <span>{session.metadata.location}</span>
                          </div>
                          {session.metadata.coPilot && (
                            <div className="col-span-2 flex justify-between mt-1 pt-1 border-t border-slate-700">
                              <span className="text-gray-400">Co-Pilot:</span>
                              <span>{drivers.find((d) => d.id === session.metadata.coPilot)?.name || "Unknown"}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => startEditingSession(session.id)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`approve-${session.id}`}
                          checked={sessionApprovals[session.id] || false}
                          onCheckedChange={() => toggleSessionApproval(session.id)}
                        />
                        <label htmlFor={`approve-${session.id}`} className="text-sm font-medium leading-none">
                          Approve for Upload
                        </label>
                      </div>
                    </CardFooter>
                  </Card>
                ))}

                <DialogFooter className="sticky bottom-0 pt-4 bg-background border-t border-slate-700">
                  {uploadInProgress ? (
                    <Button disabled className="w-full">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white"></span>
                      Reviewing...
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="w-full"
                      disabled={!anySessionApproved}
                      onClick={() => {
                        setUploadComplete(true);
                      }}
                    >
                      <HardDriveDownload className="mr-2 h-4 w-4" />
                      Finalize Review & Eject HD
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Sticky TestTrack Session Status */}
      {testTrackMode && ttSessionActive && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-2 max-w-md mx-auto">
          <Alert className="bg-blue-900/90 border-blue-700 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              TestTrack Session Active
              {ttScenarioActive && <Badge className="bg-orange-600">Recording Scenario</Badge>}
            </AlertTitle>
            <AlertDescription className="flex justify-between items-center gap-2">
              <span>
                {ttCollectedScenarios} / {ttTotalScenarios} scenarios ({Math.floor((ttCollectedScenarios / ttTotalScenarios) * 100)}%)
              </span>
              <span className="text-xs text-blue-300">
                {existingSubtasks.find((s) => s.id === selectedSubtask)?.summary ?? "Unknown"}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 border-blue-700 hover:bg-blue-800"
                onClick={() => setTtSessionModalOpen(true)}
              >
                Manage
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
