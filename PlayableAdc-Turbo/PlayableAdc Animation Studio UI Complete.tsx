import React, { useState } from 'react';
import { 
  Upload, Pause, Play, Square, Download, Menu, Plus, 
  ChevronUp, Layers, Image, Box, Type, Wand2,
  Activity, Clock, Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const PlayableAdcStudio = () => {
  const [isWaveView, setIsWaveView] = useState(false);

  return (
    <div className="h-screen bg-neutral-900 text-white flex flex-col">
      {/* Top Bar - Minimal Controls */}
      <div className="h-12 bg-neutral-800 flex items-center justify-between px-4 border-b border-neutral-700">
        {/* Left Side - Menu & Project Name */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium">Project: Casino Ad</span>
        </div>

        {/* Center - Main Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-purple-400 hover:text-purple-300">
            <Upload className="h-5 w-5" />
          </Button>
          <div className="flex items-center bg-neutral-700 rounded-md">
            <Button variant="ghost" size="icon" className="text-green-400 hover:text-green-300">
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-300">
              <Pause className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
              <Square className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300">
            <Download className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Side - View Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">1920 × 1080</span>
          <span className="text-xs text-neutral-400">100%</span>
        </div>
      </div>

      {/* Main Working Area */}
      <div className="flex-1 relative">
        {/* Ad Preview Area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[320px] h-[480px] bg-neutral-800 rounded-lg border border-neutral-700 shadow-lg">
            {/* Ad Content Goes Here */}
          </div>
        </div>

        {/* Quick Tools - Floating Panel */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-neutral-800 rounded-lg border border-neutral-700 shadow-lg">
          <div className="p-2 space-y-2">
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
              <Type className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
              <Box className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
              <Wand2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Panel - Expandable from bottom */}
      <div className="bg-neutral-800 border-t border-neutral-700">
        {/* Timeline Header with View Switch */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className="text-sm">Timeline</span>
            </div>
            
            {/* View Switch */}
            <div className="flex items-center gap-2 bg-neutral-700 rounded-full px-2 py-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 px-2 rounded-full ${!isWaveView ? 'bg-purple-600' : ''}`}
                onClick={() => setIsWaveView(false)}
              >
                <Clock className="h-3 w-3 mr-1" />
                Linear
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 px-2 rounded-full ${isWaveView ? 'bg-purple-600' : ''}`}
                onClick={() => setIsWaveView(true)}
              >
                <Activity className="h-3 w-3 mr-1" />
                Wave
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-6">
              <Plus className="h-3 w-3 mr-1" />
              Add Layer
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="h-48 flex">
          {/* Layers List */}
          <div className="w-48 border-r border-neutral-700 p-2 space-y-1">
            {/* Layer Items - Now Draggable */}
            <div 
              className="flex items-center justify-between p-1 text-sm bg-neutral-700 rounded group cursor-move"
              draggable="true"
            >
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3 text-purple-400" />
                <span>Button Animation</span>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <Box className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div 
              className="flex items-center justify-between p-1 text-sm hover:bg-neutral-700 rounded group cursor-move"
              draggable="true"
            >
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3 text-blue-400" />
                <span>Text Fade</span>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <Type className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Timeline Grid / Wave View - Now with Draggable Keyframes */}
          <div className="flex-1 relative">
            {!isWaveView ? (
              // Classical Timeline View
              <div className="absolute inset-0">
                <div className="h-8 border-b border-neutral-700 flex items-center px-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex-1 text-xs text-neutral-400 text-center">
                      {i}s
                    </div>
                  ))}
                </div>
                
                {/* Keyframes Area */}
                <div className="flex-1 p-2">
                  <div className="h-6 relative">
                    <div className="absolute left-[20%] w-[60%] h-4 bg-purple-500/20 rounded cursor-move">
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full cursor-ew-resize"
                        draggable="true"
                      />
                      <div 
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full cursor-ew-resize"
                        draggable="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Wave View
              <div className="absolute inset-0">
                <div className="h-8 border-b border-neutral-700 flex items-center px-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex-1 text-xs text-neutral-400 text-center">
                      {i}s
                    </div>
                  ))}
                </div>
                
                {/* Wave Visualization with Draggable Points */}
                <div className="flex-1 p-2">
                  {/* Button Animation Wave */}
                  <div className="h-8 relative mb-2 group">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                      <path 
                        d="M0,16 C40,16 60,8 100,8 C140,8 160,24 200,24 C240,24 260,16 300,16" 
                        stroke="#A855F7" 
                        fill="none" 
                        strokeWidth="2"
                        className="cursor-move"
                      />
                      {/* Draggable Keyframe Dots */}
                      <circle 
                        cx="100" cy="8" r="4" 
                        fill="#A855F7" 
                        className="cursor-move"
                        draggable="true"
                      />
                      <circle 
                        cx="200" cy="24" r="4" 
                        fill="#A855F7" 
                        className="cursor-move"
                        draggable="true"
                      />
                    </svg>
                  </div>
                  
                  {/* Text Fade Wave */}
                  <div className="h-8 relative group">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                      <path 
                        d="M0,16 C40,16 60,16 100,16 L150,16 C180,16 190,8 220,8 C250,8 260,16 300,16" 
                        stroke="#60A5FA" 
                        fill="none" 
                        strokeWidth="2"
                        className="cursor-move"
                      />
                      {/* Draggable Keyframe Dots */}
                      <circle 
                        cx="150" cy="16" r="4" 
                        fill="#60A5FA" 
                        className="cursor-move"
                        draggable="true"
                      />
                      <circle 
                        cx="220" cy="8" r="4" 
                        fill="#60A5FA" 
                        className="cursor-move"
                        draggable="true"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayableAdcStudio;