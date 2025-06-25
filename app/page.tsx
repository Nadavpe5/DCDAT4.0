"use client"

import { useState, useEffect, useCallback } from "react"
import {
  AlertCircle,
  Car,
  CheckCircle,
  ChevronDown,
  Cpu,
  Zap,
  Database,
  Edit,
  HardDrive,
  Map,
  Save,
  X,
  Check,
  Camera,
  Radio,
  RotateCcw,
  FileCheck2,
  HardDriveDownload,
  Terminal,
  Eye,
  BugPlay,
  ServerOff,
  RefreshCw,
  ScanBarcode,
  Satellite,
  Radar,
  Activity,
  Wifi,
  Shield,
  CircuitBoard,
  Gauge,
  Monitor,
  HardDriveIcon,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
{/* RadarDisplay and MapModal imports removed */}
import { ToggleControls } from "@/components/toggle-controls"
import { SensorButtons } from "@/components/sensor-buttons"
import type React from "react"
import Image from "next/image"
import whiteLogo from "@/public/logo-white.png"


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
  const { toast } = useToast()
  // State management
  const [time, setTime] = useState("00:00:00")
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<string>("")
  const [selectedSubtask, setSelectedSubtask] = useState<string>("")
  const [subtaskSummary, setSubtaskSummary] = useState("")
  const [subtaskType, setSubtaskType] = useState("Driving")
  const [showLoggingModal, setShowLoggingModal] = useState(false)
  
  // Enhanced Disk Usage State
  const [diskUsage, setDiskUsage] = useState(7) // Starting at 7 GB as requested
  const [diskCapacity] = useState(100) // 100 GB total capacity
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false)
  const [diskUsageHistory, setDiskUsageHistory] = useState<Array<{time: string, usage: number}>>([])
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null)
  const [isDiskEjected, setIsDiskEjected] = useState(false)
  const [sessionsRecorded, setSessionsRecorded] = useState(0)

  // Modal states (removed unused modal states)
  const [rerunModalOpen, setRerunModalOpen] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [uploaderModalOpen, setUploaderModalOpen] = useState(false)

  // Additional state variables
  const [insChecked, setInsChecked] = useState(true)
  const [velodyneChecked, setVelodyneChecked] = useState(true)
  const [testTrackMode, setTestTrackMode] = useState<false | true | "pending">(false)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)

  // Validation states
  const [gpsValid] = useState(true)
  const [signalsValid] = useState(true)
  const [gtDataValid] = useState(false)
  const [framesValid] = useState(true)
  const [radarsValid] = useState(true)

  // TestTrack session states
  const [ttSessionModalOpen, setTtSessionModalOpen] = useState(false)
  const [ttSessionActive, setTtSessionActive] = useState(false)
  const [ttScenarioActive, setTtScenarioActive] = useState(false)
  const [ttValidScenario, setTtValidScenario] = useState(false)
  const [ttCollectedScenarios, setTtCollectedScenarios] = useState(12)
  const [ttTotalScenarios] = useState(20)

  // CAR2DB Flow states (removed unused currentStep)
  const [driverPickerOpen, setDriverPickerOpen] = useState(false)
  const [subtaskSelectorOpen, setSubtaskSelectorOpen] = useState(false)
  const [driveSummaryOpen, setDriveSummaryOpen] = useState(false)
  const [isParallelTasks, setIsParallelTasks] = useState(false)

  // Driver selection states
  const [driverSearchOpen, setDriverSearchOpen] = useState(false)
  const [driverSearch, setDriverSearch] = useState("")

  // Subtask states
  const [useExistingSubtask, setUseExistingSubtask] = useState(true)
  const [subtaskDescription, setSubtaskDescription] = useState("")
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
  const [sessionApprovals, setSessionApprovals] = useState<Record<string, boolean>>({})
  const [editingSession, setEditingSession] = useState<string | null>(null)
  const [uploadInProgress] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  // Map modal states
  const [loggingMode, setLoggingMode] = useState(false)
  
  // Helper functions
  const openLoggingModal = () => setShowLoggingModal(true)
  const closeLoggingModal = () => setShowLoggingModal(false)

  // Disk usage simulation function
  const simulateDiskUsageGrowth = useCallback(() => {
    if (!isRecording) return
    
    // If no recording start time, set it now
    if (!recordingStartTime) {
      setRecordingStartTime(new Date())
      return
    }

    const currentTime = new Date()
    const elapsedMinutes = (currentTime.getTime() - recordingStartTime.getTime()) / (1000 * 60)
    
    // Simulate realistic disk usage growth: ~2.0-3.0 GB per minute of recording
    const baseGrowthRate = 2.5 // GB per minute (increased from 0.8)
    const variability = Math.random() * 0.5 - 0.25 // ±0.25 GB variation
    const growthRate = baseGrowthRate + variability
    
    // Ensure we always show some growth, even for very small time intervals
    const minGrowth = 0.3 // Minimum 0.3 GB growth per update (increased from 0.1)
    const timeBasedGrowth = elapsedMinutes * growthRate
    const actualGrowth = Math.max(minGrowth, timeBasedGrowth)
    
    // Calculate new usage (starting from 7GB)
    const newUsage = Math.min(7 + actualGrowth, diskCapacity - 5) // Leave 5GB buffer
    
    // Only update if there's actual change
    if (newUsage > diskUsage) {
      setDiskUsage(Math.round(newUsage * 10) / 10) // Round to 1 decimal place
      
      // Add to history for the mini chart
      const timeStr = currentTime.toLocaleTimeString()
      setDiskUsageHistory(prev => {
        const newHistory = [...prev, { time: timeStr, usage: newUsage }]
        // Keep only last 20 data points
        return newHistory.slice(-20)
      })
    }
  }, [isRecording, recordingStartTime, diskUsage, diskCapacity, setDiskUsage, setDiskUsageHistory, setRecordingStartTime])

  // Enhanced disk usage percentage calculation
  const getDiskUsagePercentage = () => Math.round((diskUsage / diskCapacity) * 100)
  const getDiskUsageColor = () => {
    const percentage = getDiskUsagePercentage()
    if (percentage >= 90) return { color: '#7f1d1d', glow: 'neon-glow-red', text: 'text-red-400' }
    if (percentage >= 80) return { color: '#9a3412', glow: 'neon-glow-orange', text: 'text-orange-400' }
    if (percentage >= 60) return { color: '#854d0e', glow: 'neon-glow-yellow', text: 'text-yellow-400' }
    return { color: '#1e3a8a', glow: 'neon-glow-blue-dark', text: 'text-blue-400' }
  }

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

  interface ValidTTRep {
    scenario: string;
    timestamp: string;
    valid: boolean;
    duration: number;
    regulations: string;
    technology: string;
    overlap: string;
    targetSpeed: number;
    vutSpeed: number;
  }

  interface InvalidTTRep {
    timestamp: string;
    scenario: string;
    status: string;
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
  }, [isRecording, startTime, toast, setIsRecording, setDriveSummaryOpen])

  // Start the CAR2DB flow
  const startRecordingFlow = () => {
    setDriverPickerOpen(true)
  }

  // Handle driver selection
  const handleDriverSelected = () => {
    setDriverPickerOpen(false)
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

    // Increment sessions recorded counter
    setSessionsRecorded(prev => prev + 1)

    setDriveSummaryOpen(false)
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
    } else {
      // Start fresh
      startRecordingFlow()
    }
  }

  // TestTrack session management (legacy functions - commented out)
  // const startTtSession = () => {
  //   setTtSessionActive(true)
  //   sendMqttEvent("session_start")
  //   toast({
  //     title: "TestTrack Session Started",
  //     description: "Session is now active",
  //   })
  // }

  // const stopTtSession = () => {
  //   if (ttValidScenario && startTime) {
  //     const elapsed = new Date().getTime() - startTime.getTime();
  //     if (elapsed < 5 * 60 * 1000) {
  //       toast({
  //         title: "Session Too Short",
  //         description: "At least 5 minutes required for valid repetitions.",
  //         variant: "destructive"
  //       });
  //       return;
  //     }

  //     // Save valid scenario data
  //     const durationSec = elapsed / 1000;
  //     const summary = {
  //       scenario: subtaskScenario,
  //       timestamp: startTime.toISOString(),
  //       valid: true,
  //       duration: durationSec,
  //       regulations: subtaskRegulations,
  //       technology: subtaskTechnology,
  //       overlap: subtaskOverlap,
  //       targetSpeed: subtaskTargetSpeed,
  //       vutSpeed: subtaskVutSpeed
  //     };
  //     const existing = JSON.parse(localStorage.getItem("tt-valid-reps") || "[]");
  //     existing.push(summary);
  //     localStorage.setItem("tt-valid-reps", JSON.stringify(existing));
  //   }

  //   if (!ttValidScenario) {
  //     const invalidRep = {
  //       timestamp: new Date().toISOString(),
  //       scenario: subtaskScenario,
  //       status: "invalid"
  //     };
  //     const existingReps = JSON.parse(localStorage.getItem('tt-invalid-reps') || '[]');
  //     existingReps.push(invalidRep);
  //     localStorage.setItem('tt-invalid-reps', JSON.stringify(existingReps));
  //   }

  //   // Reset all TT session state and trigger summary
  //   setTtSessionModalOpen(false);
  //   setTtSessionActive(false);
  //   setTtScenarioActive(false);
  //   setIsRecording(false);
  //   setDriveSummaryOpen(true);
  //   setSelectedSubtask("");
  //   setStartTime(null);

  //   sendMqttEvent("session_stop");

  //   toast({
  //     title: "TestTrack Session Stopped",
  //     description: "Session has been ended",
  //   });
  // };


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
    // Check if disk is ejected
    if (isDiskEjected) {
      toast({
        title: "Disk Ejected",
        description: "Please insert a disk before recording.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if disk has data and offer to clean
    if (!isRecording && diskUsage > 0) {
      setShowCleanupConfirm(true);
      return;
    }
    
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
      
      // Handle disk usage tracking for TestTrack mode
      if (!isRecording) {
        // Start recording - initialize disk usage tracking
        setRecordingStartTime(new Date())
        setDiskUsageHistory([])
        // Add initial data point
        setDiskUsageHistory([{ time: new Date().toLocaleTimeString(), usage: diskUsage }])
      } else {
        // Stop recording - clear recording start time
        setRecordingStartTime(null)
        // Increment sessions recorded counter
        setSessionsRecorded(prev => prev + 1)
      }

      toast({
        title: !isRecording ? "TestTrack Session Started" : "TestTrack Session Stopped",
        description: !isRecording ? "Ready to record scenarios" : `Session ended. Disk usage: ${diskUsage.toFixed(1)} GB`,
      })

      return
    }

    // Enhanced disk usage validation
    const diskPercentage = getDiskUsagePercentage()
    if (diskPercentage >= 90) {
      toast({
        title: "Disk Full",
        description: "Recording is blocked due to >90% disk usage.",
        variant: "destructive"
      });
      return;
    } else if (diskPercentage >= 80) {
      toast({
        title: "High Disk Usage",
        description: `Disk usage is at ${diskPercentage}%. Consider clearing space.`,
        variant: "default"
      });
    }
    if (isRecording) {
      setIsRecording(false)

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

  // Function to re-insert the disk
  const reinsertDisk = () => {
    setIsDiskEjected(false);
    toast({
      title: "Disk Inserted",
      description: "The disk has been inserted and is ready to use.",
    });
  }

  // Upload approved sessions (placeholder for future implementation)
  // Commented out to fix linting issues - will be implemented later

  const anySessionApproved = Object.values(sessionApprovals).some((approved) => approved)

  // Enhanced System Status Components
  const SystemStatusIndicator = ({ 
    name, 
    isActive = true, 
    icon, 
    description,
    priority = "normal"
  }: { 
    name: string; 
    isActive?: boolean; 
    icon?: React.ReactNode;
    description?: string;
    priority?: "high" | "normal" | "low";
  }) => {
    const getStatusColor = () => {
      if (!isActive) return "bg-red-500/20 text-red-400 border-red-500/30"
      switch (priority) {
        case "high": return "bg-green-500/20 text-green-400 border-green-500/30"
        case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
        default: return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      }
    }

    return (
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 btn-modern",
        getStatusColor()
      )}>
        <div className="flex items-center gap-2">
          {icon && <div className="w-4 h-4 flex-shrink-0">{icon}</div>}
          <div className="flex flex-col">
            <span className="text-sm font-intel-medium text-intel-display">{name}</span>
            {description && (
              <span className="text-xs opacity-70 font-intel-light">{description}</span>
            )}
          </div>
        </div>
        <div className={cn(
          "w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200",
          isActive ? "bg-current animate-pulse" : "bg-current opacity-50"
        )} />
    </div>
  )
  }

  const ValidationItem = ({
    name,
    isValid = true,
    icon,
    description,
    value,
  }: { 
    name: string; 
    isValid?: boolean; 
    icon?: React.ReactNode;
    description?: string;
    value?: string | number;
  }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:bg-slate-800/40 transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
          isValid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        )}>
          {icon || (isValid ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-intel-medium text-intel-display">{name}</span>
          {description && (
            <span className="text-xs text-slate-400 font-intel-light">{description}</span>
          )}
      </div>
      </div>
      <div className="flex items-center gap-2">
        {value && (
          <span className="text-xs text-slate-300 font-intel-regular px-2 py-1 bg-slate-700/50 rounded-lg">
            {value}
          </span>
        )}
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200",
          isValid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        )}>
          {isValid ? (
            <Check className="h-3 w-3" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </div>
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

  // Disk usage simulation effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRecording) {
      // Set recording start time when recording begins
      if (!recordingStartTime) {
        setRecordingStartTime(new Date())
      }
      
      // Update disk usage every 3 seconds during recording for smoother animation
      interval = setInterval(() => {
        simulateDiskUsageGrowth()
      }, 3000)
    } else if (!isRecording && recordingStartTime) {
      // Clear recording start time when recording stops
      setRecordingStartTime(null)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording, recordingStartTime, simulateDiskUsageGrowth])

  return (
    <div className="min-h-screen bg-background text-foreground max-w-md mx-auto relative overflow-hidden">
      {/* Enhanced Background with Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-slate-900/50 to-transparent" />
      
            {/* iOS 26 Style Header */}
      <header className="card-modern p-8 rounded-3xl relative z-10 mb-8">
        {/* Main Title and Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-intel-medium bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-2 text-intel-display tracking-tight">
            DC DAT 4.0
          </h1>
          <div className="flex justify-center mt-2">
            <button
              type="button"
              onClick={() => {
            // Require two clicks to activate TestTrack mode
            if (!testTrackMode) {
            // First click: do nothing except show toast
            toast({
              title: "TestTrack Mode",
              description: "Click again to activate TestTrack Mode.",
              variant: "default"
            });
            setTestTrackMode("pending");
            } else if (testTrackMode === "pending") {
            // Second click: activate
            setTestTrackMode(true);
            toast({
              title: "TestTrack Mode",
              description: "Activated ✅",
              variant: "default"
            });
            } else if (testTrackMode === true) {
            // Deactivate
            setTestTrackMode(false);
            toast({
              title: "TestTrack Mode",
              description: "Deactivated ❌",
              variant: "destructive"
            });
            }
              }}
              className={cn(
            "rounded-lg p-1 transition-all duration-200 flex items-center",
            testTrackMode === true
            ? "ring-2 ring-blue-400 bg-blue-900/30 shadow-lg"
            : "hover:ring-2 hover:ring-blue-300"
              )}
              aria-pressed={!!testTrackMode}
              aria-label="Toggle TestTrack Mode"
            >
              <Image
            src={whiteLogo}
            alt="Mobileye Logo"
            width={80}
            height={24}
            priority
            className="object-contain"
              />
              {testTrackMode === true && (
              <span className="ml-2 flex items-center"></span>
              )}
            </button>
          </div>
        </div>

        {/* Modern Toggle Controls - REMOVED */}
        {/* <ToggleControls ... /> */}

        {/* System Status Indicators */}
        <div className="mt-5 space-y-5">
          <div className="flex gap-3 justify-center">
            {/* Logger Pill */}
            <Badge className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-intel-medium text-xs transition-all duration-300 text-intel-display",
              "bg-green-500/20 text-green-400 border-green-500/30"
            )}>
              <HardDriveIcon className="h-3 w-3" />
              Logger
              <CheckCircle className="h-3 w-3" />
            </Badge>

            {/* EPM Pill */}
            <Badge className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-intel-medium text-xs transition-all duration-300 text-intel-display",
              "bg-green-500/20 text-green-400 border-green-500/30"
            )}>
              <Cpu className="h-3 w-3" />
              EPM
              <CheckCircle className="h-3 w-3" />
            </Badge>
              </div>

          {/* Recording Timer and Controls */}
          <div className="card-modern p-6 rounded-3xl">
            {/* --- Compact System Indicators (2 rows, above timer) --- */}
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
              {/* Row 1 */}
              <div className="flex flex-wrap gap-2 w-full justify-center">
              <div className={cn(
                "flex items-center rounded-full px-3 py-1 min-w-[90px] font-intel-medium text-xs transition-all duration-300",
                gpsValid
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
              )}>
                <span className="mr-1" role="img" aria-label="satellite">
                <Satellite className="h-4 w-4" style={{ color: "#38bdf8", filter: "drop-shadow(0 0 2px #38bdf8)" }} />
                </span>
                GPS
                {gpsValid && <CheckCircle className="h-4 w-4 ml-1 text-green-400" />}
              </div>
              <div className={cn(
                "flex items-center rounded-full px-3 py-1 min-w-[90px] font-intel-medium text-xs transition-all duration-300",
                signalsValid
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
              )}>
                <span className="mr-1" role="img" aria-label="activity">
                <Activity className="h-4 w-4" style={{ color: "#facc15", filter: "drop-shadow(0 0 2px #facc15)" }} />
                </span>
                Signals
                {signalsValid && <CheckCircle className="h-4 w-4 ml-1 text-green-400" />}
              </div>
              <div className={cn(
                "flex items-center rounded-full px-3 py-1 min-w-[90px] font-intel-medium text-xs transition-all duration-300",
                gtDataValid
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
              )}>
                <span className="mr-1" role="img" aria-label="database">
                <Database className="h-4 w-4" style={{ color: "#a3e635", filter: "drop-shadow(0 0 2px #a3e635)" }} />
                </span>
                GTData
                {gtDataValid && <CheckCircle className="h-4 w-4 ml-1 text-green-400" />}
              </div>
              </div>
              {/* Row 2 */}
              <div className="flex flex-wrap gap-2 w-full justify-center">
              <div className={cn(
                "flex items-center rounded-full px-3 py-1 min-w-[90px] font-intel-medium text-xs transition-all duration-300",
                framesValid
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
              )}>
                <span className="mr-1" role="img" aria-label="camera">
                <Camera className="h-4 w-4" style={{ color: "#60a5fa", filter: "drop-shadow(0 0 2px #60a5fa)" }} />
                </span>
                Frames
                {framesValid && <CheckCircle className="h-4 w-4 ml-1 text-green-400" />}
              </div>
              <div className={cn(
                "flex items-center rounded-full px-3 py-1 min-w-[90px] font-intel-medium text-xs transition-all duration-300",
                radarsValid
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
              )}>
                <span className="mr-1" role="img" aria-label="radar">
                <Radar className="h-4 w-4" style={{ color: "#34d399", filter: "drop-shadow(0 0 2px #34d399)" }} />
                </span>
                Radars
                {radarsValid && <CheckCircle className="h-4 w-4 ml-1 text-green-400" />}
              </div>
              </div>
            </div>
            {/* Digital Timer */}
            <div className="text-center mb-4">
              <div className="text-5xl font-intel-light bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent tracking-wider text-intel-display">
                {time}
              </div>
              {isRecording && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                  <span className="text-xs text-slate-400 font-intel-medium text-intel-display">RECORDING</span>
                </div>
              )}
            </div>

            {/* Start/Stop Recording Button */}
            <Button
              variant={isRecording ? "destructive" : isDiskEjected ? "outline" : "success"}
              size="lg"
              className={cn(
                "w-full font-intel-medium text-base text-intel-display btn-modern",
                isDiskEjected && "bg-slate-800/60 text-slate-500 border-slate-700/50"
              )}
              onClick={toggleRecording}
              disabled={isDiskEjected}
            >
              {isRecording ? (
                <>
                  <X className="mr-2 h-5 w-5" />
                  Stop Recording
                </>
              ) : isDiskEjected ? (
                <>
                  <ServerOff className="mr-2 h-5 w-5" />
                  Disk Required
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Start Recording
                </>
              )}
            </Button>

            {/* End Drive & Approve Button */}
            {hasRecorded && (
              <Button
                variant={isDiskEjected ? "outline" : "secondary"}
                size="lg"
                onClick={() => setUploaderModalOpen(true)}
                disabled={isRecording || isDiskEjected}
                className={cn(
                  "w-full font-intel-medium text-base mt-4 btn-modern bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-purple-500/20",
                  isDiskEjected && "bg-slate-800/60 text-slate-500 border-slate-700/50"
                )}
              >
                {isDiskEjected ? (
                  <>
                    <ServerOff className="w-5 h-5 mr-2" />
                    Disk Required
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-5 h-5 mr-2" />
                End Drive & Approve
                  </>
                )}
              </Button>
            )}

            {/* Sensor Buttons */}
            <div className="mt-3">
              <SensorButtons
                insActive={insChecked}
                velodyneActive={velodyneChecked}
                onInsToggle={setInsChecked}
                onVelodyneToggle={setVelodyneChecked}
                  disabled={isRecording}
              />
            </div>
          </div>

          {/* Enhanced Disk Usage Display - Modern Design */}
          <div className={cn(
            "card-modern p-6 rounded-3xl",
            isDiskEjected && "bg-slate-900/60 border-red-900/30"
          )}>
            <div className="flex items-center gap-4">
              {!isDiskEjected ? (
                <div className="relative w-20 h-20">
                  {/* Background Circle */}
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="6"
                      fill="none"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="url(#diskGradientDynamic)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${getDiskUsagePercentage() * 2.64} ${(100 - getDiskUsagePercentage()) * 2.64}`}
                      className="transition-all duration-1000 ease-out"
                      style={{
                        filter: `drop-shadow(0 0 8px ${getDiskUsageColor().color})`
                      }}
                    />
                    
                    {/* Recording Animation Ring */}
                    {isRecording && (
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        className="animate-recording-ring"
                      />
                    )}
                    <defs>
                      <linearGradient id="diskGradientDynamic" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={getDiskUsageColor().color} />
                        <stop offset="50%" stopColor={getDiskUsageColor().color} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={getDiskUsageColor().color} stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <HardDrive className="h-4 w-4 text-slate-400" />
                    <div className={cn(
                      "text-sm font-semibold mt-0.5 transition-colors duration-500",
                      getDiskUsagePercentage() >= 90 ? "text-red-400" :
                      getDiskUsagePercentage() >= 80 ? "text-orange-400" :
                      getDiskUsagePercentage() >= 60 ? "text-yellow-400" :
                      "text-blue-400"
                    )}>
                      {getDiskUsagePercentage()}%
              </div>
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 flex items-center justify-center">
                  <div className="bg-red-900/20 p-4 rounded-full">
                    <ServerOff className="h-12 w-12 text-red-500/70" />
                  </div>
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  {!isDiskEjected ? (
                    <>
                      <div className="text-lg font-bold text-slate-200">
                        {diskUsage.toFixed(1)} GB
                      </div>
                      
                      {/* Disk Cleanup Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 px-3 rounded-full btn-modern text-xs flex gap-1.5 items-center font-intel-regular"
                  disabled={isRecording}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Clear Disk
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="modal-medium modal-content">
                          <DialogHeader>
                            <DialogTitle>Clean Disk Storage</DialogTitle>
                            <DialogDescription>
                              This will permanently delete all temporary files and free up disk space.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="bg-slate-800/60 p-4 rounded-lg mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm">Current Usage</span>
                                <span className="text-sm font-medium">{diskUsage.toFixed(1)} GB</span>
                              </div>
                                                          <div className="flex items-center justify-between">
                              <span className="text-sm">After Cleanup</span>
                              <span className="text-sm font-medium text-green-400">0.0 GB</span>
                            </div>
                          </div>
                          <div className="text-sm text-slate-400">
                            This operation cannot be undone. Cleanup will not affect recorded sessions that have been approved.
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            className="btn-modern font-intel-regular"
                            onClick={(e) => {
                              // Find the closest dialog element and close it
                              const dialog = (e.target as HTMLElement).closest('[role="dialog"]');
                              const closeButton = dialog?.querySelector('[data-radix-collection-item]') as HTMLElement;
                              if (closeButton) closeButton.click();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="btn-modern font-intel-medium"
                            onClick={() => {
                              setDiskUsage(0);
                              setDiskUsageHistory([]);
                              toast({
                                title: "Disk Cleaned",
                                description: "All temporary files have been removed.",
                              });
                              
                              // Find the closest dialog element and close it
                              const dialog = document.querySelector('[role="dialog"]');
                              const closeButton = dialog?.querySelector('[data-radix-collection-item]') as HTMLElement;
                              if (closeButton) closeButton.click();
                            }}
                          >
                            Clean Disk
                          </Button>
                        </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-red-400">
                        Disk Ejected
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        Usage: N/A
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 px-3 rounded-full btn-modern text-xs flex gap-1.5 items-center font-intel-regular"
                        onClick={reinsertDisk}
                      >
                        <HardDrive className="h-3.5 w-3.5" />
                        Insert Disk
                      </Button>
                    </>
                  )}
                </div>
                
                {!isDiskEjected ? (
                  <>
                    <div className="text-xs text-slate-400/80 mb-2">
                      {(diskCapacity - diskUsage).toFixed(1)} GB available
                    </div>
                    
                    {/* Mini Usage History Chart */}
                    {diskUsageHistory.length > 0 && (
                      <div className="h-6 flex items-end gap-0.5">
                        {diskUsageHistory.slice(-12).map((point, index) => {
                          const height = Math.max((point.usage / diskCapacity) * 100, 5)
                          return (
                            <div
                              key={index}
                              className="flex-1 bg-slate-500/40 rounded-t-sm transition-all duration-300"
                              style={{ height: `${height}%` }}
                            />
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-slate-400/80 mt-2">
                    Insert disk to continue recording sessions
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

            {/* Main Content */}
      <main className="p-6 flex flex-col gap-8 relative z-10">
        {/* Radar/Map Display Component */}
        {!showMap ? (
          <div className="card-modern p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-base">Radar</h3>
              <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-1 flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-400" />
            Localized
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-1">
            200m
          </Badge>
              </div>
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
          variant="outline" 
          size="sm" 
          className="w-full mt-4 btn-modern text-blue-400 border-blue-500/20 hover:bg-blue-500/10"
          onClick={() => setShowMap(true)}
              >
          <Map className="mr-2 h-3 w-3" />
          View Map
              </Button>
            </div>
          </div>
        ) : (
          <div className="card-modern p-6 rounded-3xl h-[400px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-base">Navigation</h3>
              <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-1 flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-400" />
            Localized
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-1">
            2.3 km
          </Badge>
              </div>
            </div>
            
            {/* Main Map Area */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl h-[300px]">
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

              {/* Demo Vehicle with Endless Movement */}
              <div className="absolute top-1/2 transform -translate-y-1/2 z-20" style={{
          left: '0%',
          animation: 'endlessMove 12s linear infinite'
              }}>
          <div className="relative z-20">
            {/* Vehicle */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-white shadow-lg flex items-center justify-center relative z-20">
              <Car className="h-4 w-4 text-white" />
            </div>
            {/* Vehicle Glow */}
            <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping z-10"></div>
            {/* Speed Trail */}
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-transparent to-blue-400/60 rounded-full z-10"></div>
          </div>
              </div>

              {/* Additional Moving Vehicles */}
              <div className="absolute top-[30%] transform -translate-y-1/2 z-15" style={{
          left: '0%',
          animation: 'endlessMove 15s linear infinite 3s'
              }}>
          <div className="w-6 h-6 rounded bg-gray-600 flex items-center justify-center relative z-15">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
          </div>
              </div>

              <div className="absolute top-[70%] transform -translate-y-1/2 z-15" style={{
          left: '0%',
          animation: 'endlessMove 10s linear infinite 6s'
              }}>
          <div className="w-6 h-6 rounded bg-gray-600 flex items-center justify-center relative z-15">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
          </div>
              </div>

              {/* Dynamic Route Path */}
              <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-5">
          <div className="h-1 bg-blue-500/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
            <div className="absolute left-0 w-full h-full bg-gradient-to-r from-blue-600/60 via-blue-400/60 to-blue-600/60" style={{
              animation: 'routeFlow 3s linear infinite'
            }}></div>
          </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-3 px-1">
              <Button 
          variant="outline" 
          size="sm" 
          className="w-full btn-modern text-green-400 border-green-500/20 hover:bg-green-500/10 text-xs"
          onClick={() => setShowMap(false)}
              >
          <Radio className="mr-1.5 h-3 w-3" />
          View Radar
              </Button>
            </div>
          </div>
        )}

        {/* Session Info - Modern Design */}
        <div className="card-modern p-6 rounded-3xl">
          {selectedDriver && selectedSubtask ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-slate-300">Session Details</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/40 p-3 rounded-xl">
                  <div className="text-xs text-slate-400 mb-1">Driver</div>
                  <div className="text-sm font-medium text-slate-200">
                    {drivers.find((d) => d.id === selectedDriver)?.name || "Unknown"}
                  </div>
                </div>
                
                <div className="bg-slate-800/40 p-3 rounded-xl">
                  <div className="text-xs text-slate-400 mb-1">Subtask</div>
                  <div className="text-sm font-medium text-slate-200">
                    {existingSubtasks.find((s) => s.id === selectedSubtask)?.summary || subtaskSummary || "Custom Task"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-slate-300">No Active Session</div>
              </div>
              
              {sessionsRecorded > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 mb-2">Recent Sessions:</div>
                  {Array.from({ length: Math.min(sessionsRecorded, 3) }, (_, index) => {
                    const now = new Date();
                    const sessionTime = new Date(now.getTime() - (index * 10 * 60 * 1000)); // 10 minutes apart
                    const dateStr = sessionTime.toLocaleDateString('en-GB').split('/').reverse().join('').slice(2); // DDMMYY format
                    const timeStr = sessionTime.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS format
                    const sessionName = `PSV2_Cay16_${dateStr}_${timeStr}_205655`;
                    const duration = `${String(Math.floor(Math.random() * 30) + 15).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
                    
                    return (
                      <div key={index} className="bg-slate-800/40 p-2 rounded-lg">
                        <div className="text-xs font-mono text-slate-300">{sessionName}</div>
                        <div className="text-xs text-slate-500 mt-1">Duration: {duration}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Core System Status */}
        <div className="card-modern p-6 rounded-3xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CircuitBoard className="h-5 w-5 text-green-400" />
            <div className="text-lg font-intel-medium text-intel-display">Core Systems</div>
          </div>
          
            <div className="grid grid-cols-1 gap-3">
            <SystemStatusIndicator 
              name="Orchestrator" 
              isActive={true} 
              icon={<Cpu className="h-4 w-4" />}
              description="Main coordinator"
              priority="high"
            />
            <SystemStatusIndicator 
              name="Logger" 
              isActive={true} 
              icon={<HardDrive className="h-4 w-4" />}
              description="Data recording"
              priority="high"
            />
            <SystemStatusIndicator 
              name="MQTT" 
              isActive={true} 
              icon={<Wifi className="h-4 w-4" />}
              description="Message broker"
              priority="normal"
            />
            <SystemStatusIndicator 
              name="Ruler" 
              isActive={false} 
              icon={<Gauge className="h-4 w-4" />}
              description="Performance monitor"
              priority="low"
            />
            </div>
        </div>

        {/* System Validations removed */}

        {/* Logging Mode Button */}
        <Button 
          variant="outline" 
          onClick={openLoggingModal} 
          className="mt-4 btn-modern"
        >
          <BugPlay className="w-4 h-4 mr-1.5" />
         
          Debug Console
        </Button>

        {/* ...existing code... */}
      </main>

      {/* Driver Picker Modal (Step 1) */}
      <Dialog open={driverPickerOpen} onOpenChange={setDriverPickerOpen}>
        <DialogContent className="modal-medium modal-content">
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
        <DialogContent className="modal-large modal-content">
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

              <div className="sticky bottom-0 pt-4 bg-background z-10">
                <Button type="submit" className="w-full relative z-10">
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drive Summary Modal (Step 5) */}
      <Dialog open={driveSummaryOpen} onOpenChange={setDriveSummaryOpen}>
        <DialogContent className="modal-medium modal-content">
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

              <div className="sticky bottom-0 pt-4 bg-background z-10">
                <Button type="submit" className="w-full relative z-10">
                  Finalize Session
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rerun Modal (Step 7) */}
      <Dialog open={rerunModalOpen} onOpenChange={setRerunModalOpen}>
        <DialogContent className="modal-medium modal-content">
          <DialogHeader>
            <DialogTitle>Continue Previous Session?</DialogTitle>
            <DialogDescription>You&apos;re starting another session for the same subtask</DialogDescription>
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
        <DialogContent className="modal-medium modal-content">
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
                        {validTT.map((rep: ValidTTRep, i: number) => (
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
                        {invalidTT.map((rep: InvalidTTRep, i: number) => (
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

      {/* Disk Cleanup Confirmation Dialog */}
      <Dialog open={showCleanupConfirm} onOpenChange={setShowCleanupConfirm}>
        <DialogContent className="modal-medium modal-content">
          <DialogHeader>
            <DialogTitle>Disk Contains Data</DialogTitle>
            <DialogDescription>
              The disk already contains {diskUsage.toFixed(1)} GB of data. Would you like to clean it before recording?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-slate-800/60 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Current Usage</span>
                <span className="text-sm font-medium">{diskUsage.toFixed(1)} GB</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="btn-modern font-intel-regular"
              onClick={() => {
                setShowCleanupConfirm(false);
                // Continue with recording
                if (testTrackMode) {
                  if (!selectedSubtask) {
                    setSelectedDriver("tt-driver");
                    setSubtaskSelectorOpen(true);
                  } else {
                    setTtSessionActive(true);
                    setTtScenarioActive(false);
                    setTtValidScenario(false);
                    sendMqttEvent("session_start");
                    setIsRecording(true);
                    setHasRecorded(true);
                    setStartTime(new Date());
                    setRecordingStartTime(new Date());
                    setDiskUsageHistory([{ time: new Date().toLocaleTimeString(), usage: diskUsage }]);
                  }
                } else if (selectedSubtask) {
                  setRerunModalOpen(true);
                } else {
                  startRecordingFlow();
                }
              }}
            >
              Continue Without Cleaning
            </Button>
            <Button 
              variant="default" 
              className="btn-modern font-intel-medium"
              onClick={() => {
                setDiskUsage(0);
                setDiskUsageHistory([]);
                setShowCleanupConfirm(false);
                toast({
                  title: "Disk Cleaned",
                  description: "All temporary files have been removed.",
                });
                
                // Continue with recording
                if (testTrackMode) {
                  if (!selectedSubtask) {
                    setSelectedDriver("tt-driver");
                    setSubtaskSelectorOpen(true);
                  } else {
                    setTtSessionActive(true);
                    setTtScenarioActive(false);
                    setTtValidScenario(false);
                    sendMqttEvent("session_start");
                    setIsRecording(true);
                    setHasRecorded(true);
                    setStartTime(new Date());
                    setRecordingStartTime(new Date());
                    setDiskUsageHistory([{ time: new Date().toLocaleTimeString(), usage: 0 }]);
                  }
                } else if (selectedSubtask) {
                  setRerunModalOpen(true);
                } else {
                  startRecordingFlow();
                }
              }}
            >
              Clean Disk & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Uploader Modal (Step 6) */}
      <Dialog open={uploaderModalOpen} onOpenChange={setUploaderModalOpen}>
        <DialogContent className="modal-large modal-content">
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
                
                <div className="bg-slate-800/80 p-4 rounded-lg w-full">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300">Sessions Recorded</span>
                    <span className="text-xl font-bold text-white">{sessionsRecorded}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Disk Usage</span>
                    <span className="text-white">{diskUsage.toFixed(1)} GB / {diskCapacity} GB</span>
                  </div>
                </div>
                
                <p className="text-center text-gray-400">
                  All sessions have been reviewed. You can now eject the disk.
                </p>
                
                <Button 
                  onClick={() => {
                    setIsDiskEjected(true);
                    toast({
                      title: "Disk Ejected",
                      description: "The disk has been safely ejected.",
                    });
                    // Close modal after ejection
                    setUploadComplete(false);
                    setUploaderModalOpen(false);
                  }}
                  disabled={isDiskEjected}
                  className="w-full btn-modern font-intel-medium"
                  variant={isDiskEjected ? "outline" : "destructive"}
                >
                  {isDiskEjected ? (
                    <>
                      <ServerOff className="h-4 w-4 mr-2" />
                      Disk Ejected
                    </>
                  ) : (
                    <>
                      <HardDriveDownload className="h-4 w-4 mr-2" />
                      Eject Disk
                    </>
                  )}
                </Button>
                
                {isDiskEjected && (
                  <Alert className="bg-blue-900/30 border-blue-800">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Next Steps</AlertTitle>
                    <AlertDescription className="text-blue-300">Insert disk at Copy Station</AlertDescription>
                </Alert>
                )}
                
                {!isDiskEjected && (
                  <Alert className="bg-amber-900/30 border-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription className="text-amber-300">Eject disk before removing it</AlertDescription>
                  </Alert>
                )}
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

                <DialogFooter className="sticky bottom-0 pt-4 bg-background border-t border-slate-700 z-10">
                  {uploadInProgress ? (
                    <Button disabled className="w-full relative z-10">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white"></span>
                      Reviewing...
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="w-full relative z-10"
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

      {/* Logging Mode UI with deep debug features */}
      {showLoggingModal && (
        <Dialog open={showLoggingModal} onOpenChange={closeLoggingModal}>
          <DialogContent className="modal-full modal-content modal-logging max-w-12xl px-0">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                <Terminal className="w-5 h-5 text-muted-foreground" />
                Integration Debug Mode
              </DialogTitle>
              <DialogDescription>
                Access live system logs, diagnostics, and component-level debug actions
              </DialogDescription>
            </DialogHeader>

            {/* 🖥️ Terminal Section */}
            <div className="mb-4">
              <h4 className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
                <Cpu className="w-4 h-4" />
                Logger Output Console
              </h4>
              <div className="bg-black text-green-400 text-xs font-mono p-3 rounded h-40 overflow-y-auto mt-2">
                {"<==== Running the Docker ====>\nLogger is Alive!\nSending launch logger request... DONE\nReady to run session."}
              </div>
            </div>

            {/* 🧪 Debug Buttons */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
              <Button
              variant="secondary"
              className="flex items-center justify-center h-10 px-2 text-xs font-medium gap-1.5"
              >
              <ServerOff className="w-4 h-4" />
              Power Off
              </Button>
              <Button
              variant="secondary"
              className="flex items-center justify-center h-10 px-2 text-xs font-medium gap-1.5"
              >
              <Cpu className="w-4 h-4" />
              Health Check
              </Button>
              <Button
              variant="secondary"
              className="flex items-center justify-center h-10 px-2 text-xs font-medium gap-1.5"
              >
              <Save className="w-4 h-4" />
              Save GT
              </Button>
              <Button
              variant="secondary"
              className="flex items-center justify-center h-10 px-2 text-xs font-medium gap-1.5"
              >
              <HardDriveDownload className="w-4 h-4" />
              Mirror Disk
              </Button>
              <Button
              variant="secondary"
              className="flex items-center justify-center h-10 px-2 text-xs font-medium gap-1.5"
              >
              <RefreshCw className="w-4 h-4" />
              Restart Docker
              </Button>
              <Button
              variant="secondary"
              className="flex items-center justify-center h-10 px-2 text-xs font-medium gap-1.5"
              >
              <ScanBarcode className="w-4 h-4" />
              Generate QR
              </Button>
              <Button
              variant="destructive"
              className="flex items-center justify-center h-10 px-2 text-xs font-medium gap-1.5"
              >
              <Save className="w-4 h-4" />
              Clear GT
              </Button>
            </div>

            {/* 🔍 TAPI + Camera System Diagnostics */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* 📊 TAPI Table */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  TAPI Diagnostics
                </h4>
                <div className="rounded border bg-muted/10 p-2 text-sm text-gray-300">
                  <div className="py-1">TapiDrop: 0%</div>
                  <div className="py-1">RadarDrop: 0%</div>
                  <div className="py-1">LidarDrop: 1%</div>
                  <div className="py-1">BrainDrop: 0%</div>
                  <div className="py-1">ImageDrop: 0%</div>
                </div>
              </div>

                {/* 📷 Camera Attachments */}
                <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-muted-foreground">
                  <Car className="w-4 h-4" />
                  Connected Cameras
                </h4>
                <ul className="space-y-1 text-sm">
                  {[
                  'Main',
                  'Rear',
                  'FrontCornerLeft',
                  'FrontCornerRight',
                  'ParkingFront_Right',
                  'ParkingFront_Left',
                  'Narrow'
                  ].map((cam) => (
                  <li key={cam} className="flex items-center gap-1">
                    <Camera className="w-4 h-4 text-slate-400" />
                    {cam}
                  </li>
                  ))}
                </ul>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

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

      {/* Map Modal Component */}
      {/* MapModal removed */}

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
