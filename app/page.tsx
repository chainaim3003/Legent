"use client"

import { useState, useEffect, useRef } from "react"
import {
  Shield,
  CheckCircle,
  Building2,
  Download,
  Zap,
  Package,
  Lock,
  Building,
  User,
  Check,
  ChevronRight,
  Loader2,
  Send,
  MessageSquare,
  XCircle,
  Search,
  UserCheck,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
  ArrowDown,
  Bot,
} from "lucide-react"

// ============================================
// VERIFICATION MODE CONFIGURATION
// ============================================
const USE_MOCK_VERIFICATION = false  // Set to true for UI testing without backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Unique ID generator to prevent duplicate keys
let messageIdCounter = 0
const generateUniqueId = () => {
  return `msg-${Date.now()}-${messageIdCounter++}`
}

interface AgentCard {
  alias: string
  engagementContextRole: string
  agentType: string
  verified?: boolean
  timestamp?: string
}

interface ChatMessage {
  id: string
  text: string
  type: 'user' | 'agent'
  timestamp: Date
}

type AgenticStep = 
  | 'idle' 
  | 'fetching-buyer-agent' 
  | 'buyer-agent-fetched'
  | 'fetching-seller-agent'
  | 'seller-agent-fetched'
  | 'verifying-seller-agent'
  | 'seller-agent-verified'

const AGENT_CARDS = {
  tommyBuyerAgent: {
    alias: "tommy buyer agent",
    engagementContextRole: "Buyer Agent",
    agentType: "AI",
  },
  jupiterSellerAgent: {
    alias: "jupiter seller agent",
    engagementContextRole: "Seller Agent",
    agentType: "AI",
  },
}

const LEI_DATA = {
  tommy: {
    name: "TOMMY HILFIGER EUROPE B.V.",
    lei: "54930012QJWZMYHNJW95",
    address: "Danzigerkade 165, 1013 AP Amsterdam, Netherlands",
    url: "https://www.tommyhilfiger.eu",
  },
  jupiter: {
    name: "JUPITER KNITTING COMPANY",
    lei: "3358004DXAMRWRUIYJ05",
    address: "5/22, Textile Park, Tiruppur, Tamil Nadu, India",
    url: "https://www.jupiterknitting.com",
  },
}

export default function VerificationFlow() {
  // Chat state for Buyer Organization
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [agenticStep, setAgenticStep] = useState<AgenticStep>('idle')
  const [showBuyerDetails, setShowBuyerDetails] = useState(false)
  const [showSellerDetails, setShowSellerDetails] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Buyer side agent data
  const [buyerAgentData, setBuyerAgentData] = useState<AgentCard | null>(null)
  const [sellerAgentFromBuyerData, setSellerAgentFromBuyerData] = useState<AgentCard | null>(null)
  const [sellerAgentVerified, setSellerAgentVerified] = useState(false)

  // Seller side states (unchanged - keep existing functionality)
  const [sellerAgentFetched, setSellerAgentFetched] = useState(false)
  const [sellerAgentData, setSellerAgentData] = useState<AgentCard | null>(null)
  const [sellerAgentLoading, setSellerAgentLoading] = useState(false)
  const [buyerAgentFromSellerFetched, setBuyerAgentFromSellerFetched] = useState(false)
  const [buyerAgentFromSellerData, setBuyerAgentFromSellerData] = useState<AgentCard | null>(null)
  const [buyerAgentFromSellerLoading, setBuyerAgentFromSellerLoading] = useState(false)
  const [buyerAgentVerifying, setBuyerAgentVerifying] = useState(false)
  const [buyerAgentVerified, setBuyerAgentVerified] = useState(false)

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Auto-verify after seller agent is fetched
  useEffect(() => {
    if (agenticStep === 'seller-agent-fetched' && sellerAgentFromBuyerData && !sellerAgentVerified) {
      setTimeout(() => {
        verifySellerAgent()
      }, 1000)
    }
  }, [agenticStep, sellerAgentFromBuyerData])

  const addMessage = (text: string, type: 'user' | 'agent') => {
    const newMessage: ChatMessage = {
      id: generateUniqueId(),
      text,
      type,
      timestamp: new Date(),
    }
    setChatMessages(prev => [...prev, newMessage])
  }

  // Fetch buyer agent
  const fetchBuyerAgent = async () => {
    setAgenticStep('fetching-buyer-agent')
    addMessage("🔄 Fetching buyer agent...", 'agent')
    
    setTimeout(() => {
      const agentCard: AgentCard = {
        ...AGENT_CARDS.tommyBuyerAgent,
        verified: true,
        timestamp: new Date().toLocaleTimeString(),
      }
      setBuyerAgentData(agentCard)
      setAgenticStep('buyer-agent-fetched')
      addMessage("✅ Buyer agent fetched successfully! Click to view details.", 'agent')
    }, 2000)
  }

  // Fetch seller agent
  const fetchSellerAgent = async () => {
    setAgenticStep('fetching-seller-agent')
    addMessage("🔄 Fetching seller agent...", 'agent')
    
    setTimeout(() => {
      const agentCard: AgentCard = {
        ...AGENT_CARDS.jupiterSellerAgent,
        verified: true,
        timestamp: new Date().toLocaleTimeString(),
      }
      setSellerAgentFromBuyerData(agentCard)
      setAgenticStep('seller-agent-fetched')
      addMessage("✅ Seller agent fetched! Click to view details.", 'agent')
    }, 2000)
  }

  // Verify seller agent (automatic after fetch)
  const verifySellerAgent = async () => {
    setAgenticStep('verifying-seller-agent')
    addMessage("🔐 Automatically verifying seller agent...", 'agent')
    
    if (USE_MOCK_VERIFICATION) {
      setTimeout(() => {
        setSellerAgentVerified(true)
        setAgenticStep('seller-agent-verified')
        addMessage("✅ Seller agent verified successfully!", 'agent')
      }, 2500)
      return
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/verify/seller`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSellerAgentVerified(true)
        setAgenticStep('seller-agent-verified')
        addMessage("✅ Seller agent verified successfully!", 'agent')
      } else {
        addMessage(`❌ Verification failed: ${result.error}`, 'agent')
      }
    } catch (error) {
      addMessage(`❌ Verification error: Cannot connect to API`, 'agent')
    }
  }

  // Handle chat input
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    
    const message = inputMessage.trim().toLowerCase()
    addMessage(inputMessage, 'user')
    setInputMessage("")
    
    // Parse commands
    if (message.includes('fetch my agent') || message.includes('fetch buyer agent')) {
      fetchBuyerAgent()
    } else if (message.includes('fetch seller agent')) {
      if (buyerAgentData) {
        fetchSellerAgent()
      } else {
        addMessage("⚠️ Please fetch your buyer agent first!", 'agent')
      }
    } else if (message.includes('verify seller')) {
      if (sellerAgentFromBuyerData) {
        verifySellerAgent()
      } else {
        addMessage("⚠️ Please fetch the seller agent first!", 'agent')
      }
    } else {
      addMessage("I can help you with: 'fetch my agent', 'fetch seller agent', 'verify seller agent'", 'agent')
    }
  }

  // Seller side functions (unchanged)
  const handleFetchSellerAgent = async () => {
    setSellerAgentLoading(true)
    setTimeout(() => {
      const agentCard: AgentCard = {
        ...AGENT_CARDS.jupiterSellerAgent,
        verified: true,
        timestamp: new Date().toLocaleTimeString(),
      }
      setSellerAgentData(agentCard)
      setSellerAgentFetched(true)
      setSellerAgentLoading(false)
    }, 2000)
  }

  const handleFetchBuyerAgentFromSeller = async () => {
    setBuyerAgentFromSellerLoading(true)
    setTimeout(() => {
      const agentCard: AgentCard = {
        ...AGENT_CARDS.tommyBuyerAgent,
        verified: true,
        timestamp: new Date().toLocaleTimeString(),
      }
      setBuyerAgentFromSellerData(agentCard)
      setBuyerAgentFromSellerFetched(true)
      setBuyerAgentFromSellerLoading(false)
    }, 2000)
  }

  const handleVerifyBuyerAgent = async () => {
    setBuyerAgentVerifying(true)
    
    if (USE_MOCK_VERIFICATION) {
      setTimeout(() => {
        setBuyerAgentVerified(true)
        setBuyerAgentVerifying(false)
      }, 2500)
      return
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/verify/buyer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      const result = await response.json()
      
      if (result.success) {
        setBuyerAgentVerified(true)
      } else {
        alert(`Verification Failed: ${result.error}`)
      }
    } catch (error) {
      alert(`Cannot connect to verification API`)
    } finally {
      setBuyerAgentVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 lg:p-8">
      <div className="max-w-[1900px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            LEGENT – vLEI Verified AI Agents
          </h1>
          <p className="text-slate-600 text-sm lg:text-base font-medium">
            Powered by vLEI Infrastructure on GoogleA2A
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid gap-4 lg:gap-6 xl:grid-cols-[1fr_450px_1fr] lg:grid-cols-1">

          {/* CONTAINER 1: BUYER ORGANIZATION WITH AGENTIC FLOW */}
          <div className="border border-slate-300 rounded-xl shadow-sm overflow-hidden bg-white flex flex-col">
            {/* Buyer Organization Info */}
            <div className="bg-white p-6 lg:p-8 border-b border-slate-300">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="bg-blue-100 p-2.5 lg:p-3 rounded-lg flex-shrink-0">
                  <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base lg:text-lg font-semibold text-slate-900 mb-2 lg:mb-3">
                    Buyer Organization
                  </h2>
                  <p className="text-sm lg:text-base text-slate-700 font-medium mb-2 break-words">
                    {LEI_DATA.tommy.name}
                  </p>
                  <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-600">
                    <p>
                      <strong className="font-semibold">LEI:</strong>{" "}
                      <span className="break-all">{LEI_DATA.tommy.lei}</span>
                    </p>
                    <p>
                      <strong className="font-semibold">Address:</strong>{" "}
                      <span className="break-words">{LEI_DATA.tommy.address}</span>
                    </p>
                    <p>
                      <strong className="font-semibold">Website:</strong>{" "}
                      <a
                        href={LEI_DATA.tommy.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {LEI_DATA.tommy.url}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agentic Flow Visualization - HORIZONTAL ZIG-ZAG */}
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 p-6 lg:p-8 border-b border-slate-300 overflow-y-auto">
              <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                Agentic Verification Flow
              </h3>

              {/* Horizontal Flex Container with Wrap */}
              <div className="flex flex-wrap items-center gap-3">
                {/* ICON 1: Searching Seller Agent */}
                {['fetching-seller-agent', 'seller-agent-fetched', 'verifying-seller-agent', 'seller-agent-verified'].includes(agenticStep) && (
                  <>
                    <div className="animate-fade-in">
                      <div className="flex flex-col items-center gap-2">
                        {/* Icon Container */}
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                          agenticStep === 'fetching-seller-agent' 
                            ? 'bg-blue-500 animate-pulse' 
                            : 'bg-blue-600'
                        }`}>
                          {agenticStep === 'fetching-seller-agent' ? (
                            <Search className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '2s' }} />
                          ) : (
                            <UserCheck className="w-8 h-8 text-white" />
                          )}
                        </div>
                        {/* Text Below Icon */}
                        <div className="text-center">
                          <p className="text-xs font-bold text-blue-700 whitespace-nowrap">
                            {agenticStep === 'fetching-seller-agent' ? 'Searching...' : 'Found ✓'}
                          </p>
                          <p className="text-[10px] text-slate-500">Step 1</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow Right */}
                    {['seller-agent-fetched', 'verifying-seller-agent', 'seller-agent-verified'].includes(agenticStep) && (
                      <ArrowRight className="w-5 h-5 text-blue-500 animate-pulse flex-shrink-0" />
                    )}
                  </>
                )}

                {/* ICON 2: Fetched Seller Agent */}
                {['seller-agent-fetched', 'verifying-seller-agent', 'seller-agent-verified'].includes(agenticStep) && (
                  <>
                    <div className="animate-fade-in">
                      <div className="flex flex-col items-center gap-2">
                        {/* Icon Container */}
                        <div className="w-16 h-16 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg relative">
                          <Bot className="w-8 h-8 text-white" />
                          {sellerAgentFromBuyerData && (
                            <button
                              onClick={() => setShowSellerDetails(!showSellerDetails)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-purple-600 text-xs font-bold shadow hover:bg-purple-50"
                              title="View details"
                            >
                              i
                            </button>
                          )}
                        </div>
                        {/* Text Below Icon */}
                        <div className="text-center">
                          <p className="text-xs font-bold text-purple-700 whitespace-nowrap">Fetched ✓</p>
                          <p className="text-[10px] text-slate-500">Step 2</p>
                        </div>
                      </div>
                      {/* Expandable Details Popup */}
                      {showSellerDetails && sellerAgentFromBuyerData && (
                        <div className="absolute z-10 mt-2 p-3 bg-purple-50 border-2 border-purple-300 rounded-lg shadow-xl text-xs space-y-1 animate-fade-in w-64">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-purple-900">Agent Details</p>
                            <button onClick={() => setShowSellerDetails(false)} className="text-purple-600 hover:text-purple-800">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                          <p><strong>Alias:</strong> {sellerAgentFromBuyerData.alias}</p>
                          <p><strong>Role:</strong> {sellerAgentFromBuyerData.engagementContextRole}</p>
                          <p><strong>Type:</strong> {sellerAgentFromBuyerData.agentType}</p>
                          <p><strong>Time:</strong> {sellerAgentFromBuyerData.timestamp}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Arrow Right */}
                    {['verifying-seller-agent', 'seller-agent-verified'].includes(agenticStep) && (
                      <ArrowRight className="w-5 h-5 text-purple-500 animate-pulse flex-shrink-0" />
                    )}
                  </>
                )}

                {/* ICON 3: Verifying Seller Agent */}
                {['verifying-seller-agent', 'seller-agent-verified'].includes(agenticStep) && (
                  <>
                    <div className="animate-fade-in">
                      <div className="flex flex-col items-center gap-2">
                        {/* Icon Container */}
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                          agenticStep === 'verifying-seller-agent'
                            ? 'bg-orange-500 animate-pulse'
                            : 'bg-orange-600'
                        }`}>
                          {agenticStep === 'verifying-seller-agent' ? (
                            <ShieldCheck className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '2s' }} />
                          ) : (
                            <BadgeCheck className="w-8 h-8 text-white" />
                          )}
                        </div>
                        {/* Text Below Icon */}
                        <div className="text-center">
                          <p className="text-xs font-bold text-orange-700 whitespace-nowrap">
                            {agenticStep === 'verifying-seller-agent' ? 'Verifying...' : 'Checked ✓'}
                          </p>
                          <p className="text-[10px] text-slate-500">Step 3</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow Right */}
                    {agenticStep === 'seller-agent-verified' && (
                      <ArrowRight className="w-5 h-5 text-orange-500 animate-pulse flex-shrink-0" />
                    )}
                  </>
                )}

                {/* ICON 4: Verified Seller Agent */}
                {agenticStep === 'seller-agent-verified' && (
                  <div className="animate-fade-in">
                    <div className="flex flex-col items-center gap-2">
                      {/* Icon Container */}
                      <div className="w-16 h-16 rounded-xl bg-green-600 flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                        <ShieldCheck className="w-8 h-8 text-white" />
                      </div>
                      {/* Text Below Icon */}
                      <div className="text-center">
                        <p className="text-xs font-bold text-green-700 whitespace-nowrap">Verified! ✅</p>
                        <p className="text-[10px] text-slate-500">Step 4</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {agenticStep === 'idle' || agenticStep === 'buyer-agent-fetched' || agenticStep === 'fetching-buyer-agent' ? (
                  <div className="w-full text-center py-12 text-slate-400">
                    <Bot className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Type "fetch seller agent" to begin verification flow</p>
                  </div>
                ) : null}
              </div>

              {/* Success Message */}
              {agenticStep === 'seller-agent-verified' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800 animate-fade-in">
                  🎉 <strong>Agent authentication complete!</strong> Ready for secure transactions.
                </div>
              )}
            </div>

            {/* Chat Interface */}
            <div className="bg-slate-50 border-t border-slate-300">
              {/* Chat Messages */}
              <div className="h-48 overflow-y-auto p-4 space-y-2">
                {chatMessages.length === 0 && (
                  <div className="text-center text-sm text-slate-500 py-8">
                    <p>Type a command to start:</p>
                    <p className="text-xs mt-1">• fetch my agent</p>
                    <p className="text-xs">• fetch seller agent</p>
                  </div>
                )}
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a command..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CONTAINER 2: VERIFICATION PROGRESS (UNCHANGED) */}
          <div className="border border-indigo-200 rounded-xl p-6 lg:p-10 shadow-sm bg-white xl:sticky xl:top-8 h-fit">
            <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-6 lg:mb-8 flex items-center gap-2">
              <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
              Verification Progress
            </h3>

            <div className="space-y-4 lg:space-y-5">
              {/* Step 1: Buyer Agent Fetched */}
              <div
                className="p-6 lg:p-8 rounded-lg border-2 transition-all"
                style={{
                  borderColor: buyerAgentData ? "#3b82f6" : "#e2e8f0",
                  backgroundColor: buyerAgentData ? "#eff6ff" : "#f8fafc",
                }}
              >
                <div className="flex gap-3 lg:gap-4 items-start justify-between">
                  <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
                    <div
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors ${buyerAgentData ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"}`}
                    >
                      <Package className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">
                        Buyer Agent Card Fetched
                      </p>
                      <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">
                        {buyerAgentData ? "Complete" : "Pending"}
                      </p>
                    </div>
                  </div>
                  {buyerAgentData && (
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Seller Agent Fetched */}
              <div
                className="p-6 lg:p-8 rounded-lg border-2 transition-all"
                style={{
                  borderColor: sellerAgentFetched ? "#22c55e" : "#e2e8f0",
                  backgroundColor: sellerAgentFetched ? "#f0fdf4" : "#f8fafc",
                }}
              >
                <div className="flex gap-3 lg:gap-4 items-start justify-between">
                  <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
                    <div
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors ${sellerAgentFetched ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-600"}`}
                    >
                      <Package className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">
                        Seller Agent Card Fetched
                      </p>
                      <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">
                        {sellerAgentFetched ? "Complete" : "Pending"}
                      </p>
                    </div>
                  </div>
                  {sellerAgentFetched && (
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Seller Agent Verified by Buyer */}
              <div
                className="p-6 lg:p-8 rounded-lg border-2 transition-all"
                style={{
                  borderColor: sellerAgentVerified ? "#9333ea" : "#e2e8f0",
                  backgroundColor: sellerAgentVerified ? "#faf5ff" : "#f8fafc",
                }}
              >
                <div className="flex gap-3 lg:gap-4 items-start justify-between">
                  <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
                    <div
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors ${sellerAgentVerified ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-600"}`}
                    >
                      <Shield className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">
                        Seller Agent Verified by Buyer
                      </p>
                      <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">
                        {sellerAgentVerified ? "Complete" : "Pending"}
                      </p>
                    </div>
                  </div>
                  {sellerAgentVerified && (
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Step 4: Buyer Agent Verified by Seller */}
              <div
                className="p-6 lg:p-8 rounded-lg border-2 transition-all"
                style={{
                  borderColor: buyerAgentVerified ? "#f97316" : "#e2e8f0",
                  backgroundColor: buyerAgentVerified ? "#fff7ed" : "#f8fafc",
                }}
              >
                <div className="flex gap-3 lg:gap-4 items-start justify-between">
                  <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
                    <div
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors ${buyerAgentVerified ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-600"}`}
                    >
                      <Shield className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">
                        Buyer Agent Verified by Seller
                      </p>
                      <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">
                        {buyerAgentVerified ? "Complete" : "Pending"}
                      </p>
                    </div>
                  </div>
                  {buyerAgentVerified && (
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Step 5: Trust Established */}
              <div
                className="p-6 lg:p-8 rounded-lg border-2 transition-all"
                style={{
                  borderColor: sellerAgentVerified && buyerAgentVerified ? "#4f46e5" : "#e2e8f0",
                  backgroundColor: sellerAgentVerified && buyerAgentVerified ? "#eef2ff" : "#f8fafc",
                }}
              >
                <div className="flex gap-3 lg:gap-4 items-start justify-between">
                  <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
                    <div
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors ${
                        sellerAgentVerified && buyerAgentVerified
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Lock className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">
                        Trust Established
                      </p>
                      <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">
                        {sellerAgentVerified && buyerAgentVerified ? "vLEI Verified" : "Pending"}
                      </p>
                    </div>
                  </div>
                  {sellerAgentVerified && buyerAgentVerified && (
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CONTAINER 3: SELLER ORGANIZATION (UNCHANGED) */}
          <div className="border border-slate-300 rounded-xl shadow-sm overflow-hidden bg-white">
            {/* Seller Organization Info */}
            <div className="bg-white p-6 lg:p-8 border-b border-slate-300">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="bg-green-100 p-2.5 lg:p-3 rounded-lg flex-shrink-0">
                  <Building className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base lg:text-lg font-semibold text-slate-900 mb-2 lg:mb-3">
                    Seller Organization
                  </h2>
                  <p className="text-sm lg:text-base text-slate-700 font-medium mb-2 break-words">
                    {LEI_DATA.jupiter.name}
                  </p>
                  <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-600">
                    <p>
                      <strong className="font-semibold">LEI:</strong>{" "}
                      <span className="break-all">{LEI_DATA.jupiter.lei}</span>
                    </p>
                    <p>
                      <strong className="font-semibold">Address:</strong>{" "}
                      <span className="break-words">{LEI_DATA.jupiter.address}</span>
                    </p>
                    <p>
                      <strong className="font-semibold">Website:</strong>{" "}
                      <a
                        href={LEI_DATA.jupiter.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline break-all"
                      >
                        {LEI_DATA.jupiter.url}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Agent Card */}
            <div className="bg-white p-6 lg:p-8 border-b border-slate-300">
              <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                My Agent Card
              </h3>

              {!sellerAgentFetched && (
                <button
                  onClick={handleFetchSellerAgent}
                  disabled={sellerAgentLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {sellerAgentLoading ? (
                    <>
                      <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
                      Fetching Agent...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      Fetch My Agent Card
                    </>
                  )}
                </button>
              )}

              {sellerAgentFetched && sellerAgentData && (
                <div className="p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3 lg:mb-4">
                    <h4 className="text-sm lg:text-base font-semibold text-slate-900">Agent Card</h4>
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 flex-shrink-0" />
                  </div>
                  <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-700">
                    <p>
                      <strong className="font-semibold">Alias:</strong>{" "}
                      <span className="break-words">{sellerAgentData.alias}</span>
                    </p>
                    <p>
                      <strong className="font-semibold">Role:</strong>{" "}
                      <span className="break-words">{sellerAgentData.engagementContextRole}</span>
                    </p>
                    <p>
                      <strong className="font-semibold">Type:</strong>{" "}
                      <span className="break-words">{sellerAgentData.agentType}</span>
                    </p>
                    <p className="text-[10px] lg:text-xs text-slate-500 pt-2 lg:pt-3">
                      Fetched at: {sellerAgentData.timestamp}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Fetch Buyer Agent Section */}
            {sellerAgentFetched && (
              <div className="bg-white p-6 lg:p-8">
                <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                  <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
                  Buyer Agent Card
                </h3>

                {!buyerAgentFromSellerFetched && (
                  <button
                    onClick={handleFetchBuyerAgentFromSeller}
                    disabled={buyerAgentFromSellerLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {buyerAgentFromSellerLoading ? (
                      <>
                        <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
                        Fetching Buyer Agent...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        Fetch Buyer Agent Card
                      </>
                    )}
                  </button>
                )}

                {buyerAgentFromSellerFetched && buyerAgentFromSellerData && (
                  <>
                    <div className="p-4 lg:p-6 bg-orange-50 border border-orange-200 rounded-lg mb-4">
                      <div className="flex items-start justify-between mb-3 lg:mb-4">
                        <h4 className="text-sm lg:text-base font-semibold text-slate-900">Agent Card</h4>
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 flex-shrink-0" />
                      </div>
                      <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-700">
                        <p>
                          <strong className="font-semibold">Alias:</strong>{" "}
                          <span className="break-words">{buyerAgentFromSellerData.alias}</span>
                        </p>
                        <p>
                          <strong className="font-semibold">Role:</strong>{" "}
                          <span className="break-words">{buyerAgentFromSellerData.engagementContextRole}</span>
                        </p>
                        <p>
                          <strong className="font-semibold">Type:</strong>{" "}
                          <span className="break-words">{buyerAgentFromSellerData.agentType}</span>
                        </p>
                        <p className="text-[10px] lg:text-xs text-slate-500 pt-2 lg:pt-3">
                          Fetched at: {buyerAgentFromSellerData.timestamp}
                        </p>
                      </div>
                    </div>

                    {!buyerAgentVerified && (
                      <button
                        onClick={handleVerifyBuyerAgent}
                        disabled={buyerAgentVerifying}
                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {buyerAgentVerifying ? (
                          <>
                            <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            Verify Buyer Agent Card
                          </>
                        )}
                      </button>
                    )}

                    {buyerAgentVerified && (
                      <div className="p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 flex-shrink-0" />
                          <p className="text-xs lg:text-sm font-semibold text-green-700">
                            Buyer Agent Verified by Seller
                          </p>
                        </div>
                        <div className="text-xs lg:text-sm text-slate-700 space-y-2">
                          <p>
                            <strong className="font-semibold">Validation Successful:</strong> The{" "}
                            <span className="font-semibold">{buyerAgentFromSellerData?.alias}</span> is validated.
                          </p>
                          <a
                            href="http://localhost:3902/identifiers/EGNlvZ3YwQ4BKsZm1Dvqyy9WbN2dQgDuyhXEXwo8TXYR"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            View Details
                            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
