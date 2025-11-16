"use client"

import { useState, useEffect, useRef } from "react"
import { Building, Bot, Send, Check, Shield, Package, Lock } from "lucide-react"

type TabType = 'home' | 'exporter' | 'importer' | 'marketplace' | 'regulator'

interface ChatMessage {
  id: string
  text: string
  type: 'user' | 'agent'
  timestamp: Date
}

interface AgentCard {
  alias: string
  engagementContextRole: string
  agentType: string
  verified?: boolean
  timestamp?: string
  name?: string
  agentAID?: string
  oorRole?: string
}

type SellerAgenticStep =
  | 'idle'
  | 'fetching-seller-agent'
  | 'seller-agent-fetched'
  | 'fetching-buyer-agent'
  | 'buyer-agent-fetched'
  | 'verifying-buyer-agent'
  | 'buyer-agent-verified'

let messageIdCounter = 0
const generateUniqueId = () => {
  return `msg-${Date.now()}-${messageIdCounter++}`
}

const USE_MOCK_VERIFICATION = false
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const LEI_DATA = {
  tommy: {
    name: "TOMMY HILFIGER EUROPE B.V.",
    lei: "54930012QJWZMYHNJW95",
    address: "Danzigerkade 165, 1013 AP Amsterdam, Netherlands",
  },
  jupiter: {
    name: "JUPITER KNITTING COMPANY",
    lei: "3358004DXAMRWRUIYJ05",
    address: "5/22, Textile Park, Tiruppur, Tamil Nadu, India",
  },
}

export default function AlgoTitanHome() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [selectedBuyer, setSelectedBuyer] = useState<'BUYER_1' | 'BUYER_2'>('BUYER_1')

  const handleTabSwitch = (tab: TabType) => setActiveTab(tab)
  const handleBuyerSelection = (buyer: 'BUYER_1' | 'BUYER_2') => {
    setSelectedBuyer(buyer)
    setActiveTab('importer')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navigation from EnhancedHome.tsx */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900 mr-8">Algo TITAN</h1>
            
            {/* Main tabs */}
            <div className="flex-1 flex justify-center space-x-2">
              <NavBtn active={activeTab==='home'} onClick={()=>handleTabSwitch('home')}>🏠 Home</NavBtn>
              <NavBtn active={activeTab==='marketplace'} onClick={()=>handleTabSwitch('marketplace')}>🏬 Marketplace</NavBtn>
            </div>
          </div>

          {/* Role tabs */}
          <div className="flex justify-center space-x-2 mb-2">
            <NavBtn active={activeTab==='exporter'} onClick={()=>handleTabSwitch('exporter')}>📦 Exporter</NavBtn>
            <NavBtn active={activeTab==='importer'} onClick={()=>handleTabSwitch('importer')} green>🏪 Importer</NavBtn>
            <NavBtn active={activeTab==='regulator'} onClick={()=>handleTabSwitch('regulator')}>🏛️ Regulator</NavBtn>
          </div>

          {/* Sub-roles */}
          {activeTab==='importer' && (
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">🏪 Importer:</span>
                <SubBtn active={selectedBuyer==='BUYER_1'} onClick={()=>handleBuyerSelection('BUYER_1')}>Buyer 1</SubBtn>
                <SubBtn active={selectedBuyer==='BUYER_2'} onClick={()=>handleBuyerSelection('BUYER_2')}>Buyer 2</SubBtn>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="min-h-screen">
        {activeTab==='home' && <HomeSection />}
        {activeTab==='marketplace' && <MarketplaceSection />}
        {activeTab==='exporter' && <SellerOrganization />}
        {['importer','regulator'].includes(activeTab) && (
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 capitalize">{activeTab.replace('-',' ')} Dashboard</h2>
              <p className="text-gray-600">Dashboard content from algoTITANV2 will be integrated here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Helper components
function NavBtn({active,onClick,children,purple,red,green}:any) {
  const color = purple ? 'purple' : red ? 'red' : green ? 'green' : 'blue'
  const activeClass = active ? `bg-${color}-100 text-${color}-700` : 'text-gray-500 hover:text-gray-700'
  return <button onClick={onClick} className={`px-4 py-2.5 rounded-md font-medium transition ${activeClass}`}>{children}</button>
}

function SubBtn({active,onClick,children}:any) {
  return <button onClick={onClick} className={`px-2 py-1 rounded text-xs font-medium transition ${active?'bg-purple-100 text-purple-700':'text-gray-500 hover:bg-gray-100'}`}>{children}</button>
}

// Main sections from EnhancedHome.tsx
function HomeSection() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <TradeNews />
      <PainPoints />
      <Testimonials />
      <UserTypes />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        <div className="mb-6 w-fit mx-auto px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          Powered by Algorand • Fully Regulated
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
          <span className="text-blue-600">Algo <span style={{letterSpacing:'0.3em'}}>TITAN</span></span>
        </h1>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-600 mt-4">
          Trade Intelligence & Tokenized Asset Network
        </h2>
        <p className="text-lg sm:text-xl text-blue-600 mt-4">
          Unlock Web3 for Your Small Business Working Capital
        </p>
        <ul className="text-lg text-gray-600 text-left space-y-4 max-w-2xl mx-auto mt-8">
          <li className="flex items-start gap-3"><span className="text-green-500 text-xl">✅</span><span>Transform trade documents into instant liquidity</span></li>
          <li className="flex items-start gap-3"><span className="text-green-500 text-xl">✅</span><span>Access global markets through regulated blockchain</span></li>
          <li className="flex items-start gap-3"><span className="text-green-500 text-xl">✅</span><span>Get paid faster with automated smart contracts</span></li>
        </ul>
        <div className="mt-12 flex gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">Start Free Trial →</button>
          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium">Watch Demo</button>
        </div>
      </div>
    </section>
  )
}

function MarketplaceSection() {
  const [flow,setFlow] = useState<'direct'|'financing'>('direct')
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🏬 Marketplace Dashboard</h1>
        <p className="text-xl text-gray-600">Complete Trade Finance Ecosystem</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Select Transaction Type</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div onClick={()=>setFlow('direct')} className={`p-6 border-2 rounded-lg cursor-pointer ${flow==='direct'?'border-orange-500 bg-orange-50':'border-gray-200'}`}>
            <div className="flex items-center mb-4"><span className="text-3xl mr-3">🏪</span><div><h3 className="text-xl font-bold">Direct Sale</h3><p className="text-gray-600">Exporter → Importer</p></div></div>
            <ul className="space-y-2 text-sm">
              <li>✓ 1% marketplace fee</li>
              <li>✓ Instant settlement</li>
            </ul>
          </div>
          <div onClick={()=>setFlow('financing')} className={`p-6 border-2 rounded-lg cursor-pointer ${flow==='financing'?'border-blue-500 bg-blue-50':'border-gray-200'}`}>
            <div className="flex items-center mb-4"><span className="text-3xl mr-3">🚀</span><div><h3 className="text-xl font-bold">Financing</h3><p className="text-gray-600">Fractionalized Investment</p></div></div>
            <ul className="space-y-2 text-sm">
              <li>✓ Fractionalized shares</li>
              <li>✓ Global investor access</li>
            </ul>
          </div>
        </div>
      </div>
      {flow==='direct' && <DirectSale />}
      <Stats />
    </div>
  )
}

function DirectSale() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Available BLs</h2>
      <div className="border rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <div><h3 className="font-semibold">Cotton Fabric Export to Hamburg</h3><p className="text-sm text-gray-600">Seller: Tirupur Textiles</p></div>
          <div className="text-2xl font-bold text-orange-600">$150,000</div>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg">💰 Buy Now</button>
      </div>
    </div>
  )
}

function Stats() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Statistics</h2>
      <div className="grid md:grid-cols-4 gap-6 text-center">
        <div><div className="text-3xl font-bold text-blue-600">$2.3M</div><div className="text-sm text-gray-600">Total Volume</div></div>
        <div><div className="text-3xl font-bold text-green-600">156</div><div className="text-sm text-gray-600">Active Listings</div></div>
        <div><div className="text-3xl font-bold text-orange-600">$23K</div><div className="text-sm text-gray-600">Fees Collected</div></div>
        <div><div className="text-3xl font-bold text-purple-600">847</div><div className="text-sm text-gray-600">Transactions</div></div>
      </div>
    </div>
  )
}

function TradeNews() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Current on Global Trade</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold mb-4">🌐 WTO Updates</h3>
            <div className="border-l-2 border-blue-500 pl-4">
              <h4 className="font-medium text-sm">Trade Facilitation</h4>
              <p className="text-xs text-gray-600">Reduced compliance costs</p>
              <span className="text-xs text-blue-600">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PainPoints() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Why MSMEs Choose Algo Titans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {icon:'⚡',title:'Faster Velocity',desc:'Weeks to minutes'},
            {icon:'💰',title:'Better Yields',desc:'4-8% APY on capital'},
            {icon:'🛡️',title:'Compliance',desc:'Built-in standards'}
          ].map((p,i)=>(
            <div key={i} className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4"><span className="text-2xl">{p.icon}</span></div>
              <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
              <p className="text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Trusted by Trade Professionals</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {name:'Gopal Velusamy',role:'Jupiter Knitting',quote:'Instant settlements'},
            {name:'Maria Santos',role:'Global Import',quote:'Buy with USDC'},
            {name:'David Chen',role:'Asia Fund',quote:'12-14% APY'}
          ].map((t,i)=>(
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 border">
              <p className="italic mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-500">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UserTypes() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Built for Every Participant</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {icon:'📦',title:'For Exporters',desc:'Get paid in 3 days'},
            {icon:'🏪',title:'For Importers',desc:'Buy verified documents'},
            {icon:'🚢',title:'For Carriers',desc:'Digital BLs'},
            {icon:'🏛️',title:'Institutional',desc:'12-14% APY'},
            {icon:'💵',title:'Retail',desc:'Start with $50'},
            {icon:'🛡️',title:'Regulators',desc:'Real-time audits'}
          ].map((u,i)=>(
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4 text-center">{u.icon}</div>
              <h3 className="text-xl font-bold text-center mb-2">{u.title}</h3>
              <p className="text-gray-600 text-center text-sm">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {title:'Starter',price:'$99/mo',btn:'Start Free Trial'},
            {title:'Professional',price:'$499/mo',btn:'Start Trial',popular:true},
            {title:'Enterprise',price:'Custom',btn:'Contact Sales'}
          ].map((p,i)=>(
            <div key={i} className={`bg-white border rounded-2xl p-8 ${p.popular?'border-4 border-blue-500 scale-105':''}`}>
              <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
              <div className="text-4xl font-bold mb-4">{p.price}</div>
              <button className={`w-full py-3 rounded-lg text-white ${p.popular?'bg-blue-600':'bg-gray-600'}`}>{p.btn}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Accelerate Your Business?</h2>
        <p className="text-xl text-blue-100 mb-8">Join 500+ businesses transforming trade finance</p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold">Get Started →</button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold">Schedule Demo</button>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t bg-gray-100 py-12">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Algo <span style={{letterSpacing:'0.3em'}}>TITAN</span></p>
      </div>
    </footer>
  )
}

function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-4">About Algo <span style={{letterSpacing:'0.3em'}}>TITAN</span></h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">🔬 Technical Innovation</h2>
        <ul className="space-y-3">
          <li className="flex items-start space-x-2"><span className="text-green-500">✓</span><span><strong>DCSA v3.0:</strong> Enhanced RWA classification</span></li>
          <li className="flex items-start space-x-2"><span className="text-green-500">✓</span><span><strong>Atomic Settlement:</strong> Single-transaction payment</span></li>
        </ul>
      </div>
    </div>
  )
}