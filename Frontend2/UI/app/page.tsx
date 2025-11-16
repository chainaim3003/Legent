"use client"

import { useState } from "react"
import { Home, Bot } from "lucide-react"
import AlgoTitanHome from "@/components/flows/AlgoTitanHome"
import AgenticFlow from "@/components/flows/AgenticFlow"

type MainTab = 'home' | 'agentic-flow'

export default function MainPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('home')

  return (
    <div className="min-h-screen bg-white">
      {/* Top Tab Navigation */}
      <div className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1900px] mx-auto px-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-6 py-4 transition-all ${
                activeTab === 'home'
                  ? 'bg-teal-600 font-semibold border-b-4 border-teal-400'
                  : 'hover:bg-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home Page</span>
            </button>

            <button
              onClick={() => setActiveTab('agentic-flow')}
              className={`flex items-center gap-2 px-6 py-4 transition-all ${
                activeTab === 'agentic-flow'
                  ? 'bg-blue-600 font-semibold border-b-4 border-blue-400'
                  : 'hover:bg-slate-800'
              }`}
            >
              <Bot className="w-5 h-5" />
              <span>Agentic Flow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full">
        {activeTab === 'home' && <AlgoTitanHome />}
        {activeTab === 'agentic-flow' && <AgenticFlow />}
      </div>
    </div>
  )
}
