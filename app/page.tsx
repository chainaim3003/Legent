// "use client"

// import { useState } from "react"
// import {
//   Shield,
//   CheckCircle,
//   Building2,
//   Download,
//   Zap,
//   ChevronRight,
//   Package,
//   Lock,
//   Building,
//   User,
//   ZapIcon,
//   Check,
// } from "lucide-react"

// interface AgentCard {
//   alias: string
//   engagementContextRole: string
//   agentType: string
//   verified?: boolean
//   timestamp?: string
// }

// interface VerificationChain {
//   delegatorAid: string
//   delegatorSaid: string
//   delegateeAid: string
//   delegateeSaid: string
//   rootVerified: boolean
// }

// const AGENT_CARDS = {
//   tommyBuyerAgent: {
//     alias: "tommy buyer agent",
//     engagementContextRole: "Buyer Agent",
//     agentType: "AI",
//     legalName: "Chief Procurement Officer",
//     officialRole: "ChiefProcurementOfficer",
//   },
//   jupiterSellerAgent: {
//     alias: "jupiter seller agent",
//     engagementContextRole: "Seller Agent",
//     agentType: "AI",
//     legalName: "Chief Sales Officer",
//     officialRole: "ChiefSalesOfficer",
//   },
// }

// const LEI_DATA = {
//   tommy: {
//     name: "TOMMY HILFIGER EUROPE B.V.",
//     lei: "54930012QJWZMYHNJW95",
//     address: "Danzigerkade 165, 1013 AP Amsterdam, Netherlands",
//     url: "https://www.tommyhilfiger.eu",
//     role: "Buyer",
//     registry: "TOMMY_REGISTRY",
//   },
//   jupiter: {
//     name: "JUPITER KNITTING COMPANY",
//     lei: "3358004DXAMRWRUIYJ05",
//     address: "5/22, Textile Park, Tiruppur, Tamil Nadu, India",
//     url: "https://www.jupiterknitting.com",
//     role: "Seller",
//     registry: "JUPITER_REGISTRY",
//   },
// }

// const SELLERS_LIST = [
//   { id: "seller1", name: "JUPITER KNITTING COMPANY", lei: "3358004DXAMRWRUIYJ05" },
//   { id: "seller2", name: "Premium Textiles Ltd", lei: "2458901QWERTY123456" },
//   { id: "seller3", name: "Global Fabrics Inc", lei: "5678901ASDFGH654321" },
// ]

// const BUYERS_LIST = [
//   { id: "buyer1", name: "TOMMY HILFIGER EUROPE B.V.", lei: "54930012QJWZMYHNJW95" },
//   { id: "buyer2", name: "Fashion Forward Co", lei: "1234567ZXCVBN987654" },
//   { id: "buyer3", name: "Style & Commerce Ltd", lei: "9876543QWEASD321098" },
// ]

// export default function VerificationFlow() {
//   // BUYER SIDE - My Agent
//   const [buyerMyAgentFetched, setBuyerMyAgentFetched] = useState(false)
//   const [buyerMyAgentData, setBuyerMyAgentData] = useState<AgentCard | null>(null)
//   const [buyerMyAgentLoading, setBuyerMyAgentLoading] = useState(false)

//   // BUYER SIDE - Seller Agent Selection & Verification
//   const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
//   const [showSellerAgentColumn, setShowSellerAgentColumn] = useState(false)
//   const [sellerAgentFetched, setSellerAgentFetched] = useState(false)
//   const [sellerAgentData, setSellerAgentData] = useState<AgentCard | null>(null)
//   const [sellerAgentLoading, setSellerAgentLoading] = useState(false)
//   const [sellerAgentVerifying, setSellerAgentVerifying] = useState(false)
//   const [sellerAgentVerified, setSellerAgentVerified] = useState(false)
//   const [sellerVerificationChain, setSellerVerificationChain] = useState<VerificationChain | null>(null)

//   // SELLER SIDE - My Agent
//   const [sellerMyAgentFetched, setSellerMyAgentFetched] = useState(false)
//   const [sellerMyAgentData, setSellerMyAgentData] = useState<AgentCard | null>(null)
//   const [sellerMyAgentLoading, setSellerMyAgentLoading] = useState(false)

//   // SELLER SIDE - Buyer Agent Selection & Verification
//   const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null)
//   const [showBuyerAgentColumn, setShowBuyerAgentColumn] = useState(false)
//   const [buyerAgentFetched, setBuyerAgentFetched] = useState(false)
//   const [buyerAgentData, setBuyerAgentData] = useState<AgentCard | null>(null)
//   const [buyerAgentLoading, setBuyerAgentLoading] = useState(false)
//   const [buyerAgentVerifying, setBuyerAgentVerifying] = useState(false)
//   const [buyerAgentVerified, setBuyerAgentVerified] = useState(false)
//   const [buyerVerificationChain, setBuyerVerificationChain] = useState<VerificationChain | null>(null)

//   const handleFetchBuyerMyAgent = async () => {
//     setBuyerMyAgentLoading(true)
//     setTimeout(() => {
//       const agentCard: AgentCard = {
//         ...AGENT_CARDS.tommyBuyerAgent,
//         verified: true,
//         timestamp: new Date().toLocaleTimeString(),
//       }
//       setBuyerMyAgentData(agentCard)
//       setBuyerMyAgentFetched(true)
//       setBuyerMyAgentLoading(false)
//     }, 2000)
//   }

//   const handleFetchSellerMyAgent = async () => {
//     setSellerMyAgentLoading(true)
//     setTimeout(() => {
//       const agentCard: AgentCard = {
//         ...AGENT_CARDS.jupiterSellerAgent,
//         verified: true,
//         timestamp: new Date().toLocaleTimeString(),
//       }
//       setSellerMyAgentData(agentCard)
//       setSellerMyAgentFetched(true)
//       setSellerMyAgentLoading(false)
//     }, 2000)
//   }

//   const handleFetchSellerAgent = async () => {
//     setSellerAgentLoading(true)
//     setTimeout(() => {
//       const agentCard: AgentCard = {
//         ...AGENT_CARDS.jupiterSellerAgent,
//         verified: true,
//         timestamp: new Date().toLocaleTimeString(),
//       }
//       setSellerAgentData(agentCard)
//       setSellerAgentFetched(true)
//       setSellerAgentLoading(false)
//     }, 2000)
//   }

//   const handleVerifySellerAgent = async () => {
//     setSellerAgentVerifying(true)
//     setTimeout(() => {
//       const chain: VerificationChain = {
//         delegatorAid: "EGKCLEF2SASVKXVK23JP4QC3ESCVJND6E46SC",
//         delegatorSaid: "EO5NY3DHZAJSWJW2NN23KU5PJHR4AYPV2GVFJ",
//         delegateeAid: "EADNZ7DXAMRWRUIYJ05XVZQLKPOR2TUVWXYZA",
//         delegateeSaid: "ECBCIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNO",
//         rootVerified: true,
//       }
//       setSellerVerificationChain(chain)
//       setSellerAgentVerified(true)
//       setSellerAgentVerifying(false)
//     }, 2500)
//   }

//   const handleFetchBuyerAgent = async () => {
//     setBuyerAgentLoading(true)
//     setTimeout(() => {
//       const agentCard: AgentCard = {
//         ...AGENT_CARDS.tommyBuyerAgent,
//         verified: true,
//         timestamp: new Date().toLocaleTimeString(),
//       }
//       setBuyerAgentData(agentCard)
//       setBuyerAgentFetched(true)
//       setBuyerAgentLoading(false)
//     }, 2000)
//   }

//   const handleVerifyBuyerAgent = async () => {
//     setBuyerAgentVerifying(true)
//     setTimeout(() => {
//       const chain: VerificationChain = {
//         delegatorAid: "EADMX9ZHZAPZIQQ7PU6CGKXVK23JP4QC3ESCV",
//         delegatorSaid: "EBJND6E46SCKYTOZXIENHUDQVWXYZABCDEFGH",
//         delegateeAid: "ECKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRS",
//         delegateeSaid: "EDTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZA",
//         rootVerified: true,
//       }
//       setBuyerVerificationChain(chain)
//       setBuyerAgentVerified(true)
//       setBuyerAgentVerifying(false)
//     }, 2500)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 lg:p-8">
//       <div className="max-w-[1900px] mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8 lg:mb-12">
//           <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//             LEGENT – vLEI Verified AI Agents
//           </h1>
//           <p className="text-slate-600 text-sm lg:text-base font-medium">Powered by vLEI Infrastructure on GoogleA2A</p>
//         </div>

//         <div className="grid gap-4 lg:gap-6 xl:grid-cols-[minmax(400px,1fr)_minmax(350px,400px)_minmax(400px,1fr)] lg:grid-cols-1">
//           {/* GROUP 1: BUYER ORGANIZATION + BUYER MY AGENT + SELLER AGENT (UNIFIED CONTAINER) */}
//           <div className="border border-slate-300 rounded-xl shadow-sm overflow-hidden bg-white">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-full">
//               {/* LEFT COLUMN: Buyer Organization + My Agent Card + Fetch Button */}
//               <div className="border-b md:border-b-0 md:border-r border-slate-300">
//                 {/* Buyer Organization */}
//                 <div className="bg-white p-6 lg:p-8 border-b border-slate-300 animate-slide-in-left">
//                   <div className="flex items-start gap-3 lg:gap-4">
//                     <div className="bg-blue-100 p-2.5 lg:p-3 rounded-lg flex-shrink-0 animate-float-bounce">
//                       <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h2 className="text-base lg:text-lg font-semibold text-slate-900 mb-2 lg:mb-3">Buyer Organization</h2>
//                       <p className="text-sm lg:text-base text-slate-700 font-medium mb-2 break-words">{LEI_DATA.tommy.name}</p>
//                       <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-600">
//                         <p>
//                           <strong className="font-semibold">LEI:</strong> <span className="break-all">{LEI_DATA.tommy.lei}</span>
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Address:</strong> <span className="break-words">{LEI_DATA.tommy.address}</span>
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Website:</strong>{" "}
//                           <a
//                             href={LEI_DATA.tommy.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:underline break-all inline-block"
//                           >
//                             {LEI_DATA.tommy.url}
//                           </a>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* My Agent Card */}
//                 <div className="bg-white p-6 lg:p-8 border-b border-slate-300">
//                   <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
//                     <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
//                     My Agent Card
//                   </h3>

//                   {!buyerMyAgentFetched && (
//                     <button
//                       onClick={handleFetchBuyerMyAgent}
//                       disabled={buyerMyAgentLoading}
//                       className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
//                     >
//                       {buyerMyAgentLoading ? (
//                         <>
//                           <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
//                           Fetching My Agent...
//                         </>
//                       ) : (
//                         <>
//                           <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
//                           Fetch My Agent Card
//                         </>
//                       )}
//                     </button>
//                   )}

//                   {buyerMyAgentFetched && buyerMyAgentData && (
//                     <div className="p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-lg animate-scale-in">
//                       <div className="flex items-start justify-between mb-3 lg:mb-4">
//                         <h4 className="text-sm lg:text-base font-semibold text-slate-900">Agent Card</h4>
//                         <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 animate-checkmark-bounce flex-shrink-0" />
//                       </div>
//                       <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-700">
//                         <p>
//                           <strong className="font-semibold">Alias:</strong> <span className="break-words">{buyerMyAgentData.alias}</span>
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Role:</strong>{" "}
//                           <span className="break-words">{buyerMyAgentData.engagementContextRole}</span>
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Type:</strong> <span className="break-words">{buyerMyAgentData.agentType}</span>
//                         </p>
//                         <p className="text-[10px] lg:text-xs text-slate-500 pt-2 lg:pt-3">Fetched at: {buyerMyAgentData.timestamp}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Fetch Seller Agent Button */}
//                 {buyerMyAgentFetched && (
//                   <div className="bg-white p-6 lg:p-8">
//                     <button
//                       onClick={() => setShowSellerAgentColumn(!showSellerAgentColumn)}
//                       className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
//                       Fetch Seller Agent Card
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* RIGHT COLUMN: Seller Agent Card Section */}
//               <div className="bg-white min-h-[200px]">
//                 {showSellerAgentColumn && (
//                   <div className="p-6 lg:p-8 animate-fade-in-up h-full">
//                     <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
//                       <ZapIcon className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 animate-pulse" />
//                       Seller Agent Card
//                     </h3>

//                     {!selectedSeller && (
//                       <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
//                         {SELLERS_LIST.map((seller) => (
//                           <div
//                             key={seller.id}
//                             onClick={() => {
//                               setSelectedSeller(seller.id)
//                               setSellerAgentFetched(false)
//                               setSellerAgentVerified(false)
//                             }}
//                             className="p-3 lg:p-4 border-2 border-slate-200 bg-slate-50 hover:border-purple-300 rounded-lg cursor-pointer transition-colors"
//                           >
//                             <p className="font-medium text-xs lg:text-sm text-slate-900 break-words">{seller.name}</p>
//                             <p className="text-[10px] lg:text-xs text-slate-500 break-all">{seller.lei}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {selectedSeller && !sellerAgentFetched && (
//                       <button
//                         onClick={handleFetchSellerAgent}
//                         disabled={sellerAgentLoading}
//                         className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2 mb-4 lg:mb-6"
//                       >
//                         {sellerAgentLoading ? (
//                           <>
//                             <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
//                             Fetching Seller Agent...
//                           </>
//                         ) : (
//                           <>
//                             <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
//                             Get Seller Agent
//                           </>
//                         )}
//                       </button>
//                     )}

//                     {sellerAgentFetched && sellerAgentData && (
//                       <div className="p-4 lg:p-6 bg-purple-50 border border-purple-200 rounded-lg mb-4 lg:mb-6 animate-scale-in">
//                         <div className="flex items-start justify-between mb-3 lg:mb-4">
//                           <h4 className="text-sm lg:text-base font-semibold text-slate-900">Agent Card</h4>
//                           <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 animate-checkmark-bounce flex-shrink-0" />
//                         </div>
//                         <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-700">
//                           <p>
//                             <strong className="font-semibold">Alias:</strong> <span className="break-words">{sellerAgentData.alias}</span>
//                           </p>
//                           <p>
//                             <strong className="font-semibold">Role:</strong>{" "}
//                             <span className="break-words">{sellerAgentData.engagementContextRole}</span>
//                           </p>
//                           <p>
//                             <strong className="font-semibold">Type:</strong> <span className="break-words">{sellerAgentData.agentType}</span>
//                           </p>
//                           <p className="text-[10px] lg:text-xs text-slate-500 pt-2 lg:pt-3">Fetched at: {sellerAgentData.timestamp}</p>
//                         </div>
//                       </div>
//                     )}

//                     {sellerAgentFetched && !sellerAgentVerified && (
//                       <button
//                         onClick={handleVerifySellerAgent}
//                         disabled={sellerAgentVerifying}
//                         className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
//                       >
//                         {sellerAgentVerifying ? (
//                           <>
//                             <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
//                             Verifying...
//                           </>
//                         ) : (
//                           <>
//                             <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
//                             Verify the Seller Agent Card
//                           </>
//                         )}
//                       </button>
//                     )}

//                     {sellerAgentVerified && sellerVerificationChain && (
//                       <div className="mt-4 lg:mt-6 p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg animate-fade-in-up animate-color-transition">
//                         <div className="flex items-center gap-2 mb-3 lg:mb-4">
//                           <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 animate-pulse-glow flex-shrink-0" />
//                           <p className="text-xs lg:text-sm font-semibold text-green-700">Seller Agent Card Verified by Buyer</p>
//                         </div>
//                         <div className="text-xs lg:text-sm text-slate-700 space-y-2 lg:space-y-4 pl-6 lg:pl-7">
//                           <p>
//                             <strong className="font-semibold">Validation Successful:</strong> The{" "}
//                             <span className="font-semibold">{sellerAgentData?.alias}</span> is validated for delegation
//                             from its OOR holder.
//                           </p>
//                           <a
//                             href="http://localhost:3902/identifiers/EGNlvZ3YwQ4BKsZm1Dvqyy9WbN2dQgDuyhXEXwo8TXYR"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline break-all"
//                           >
//                             View Identifier Details
//                             <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
//                           </a>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* GROUP 2: VERIFICATION PROGRESS (CENTER) */}
//           <div className="border border-indigo-200 rounded-xl p-6 lg:p-10 xl:p-12 shadow-sm bg-white xl:sticky xl:top-8 h-fit">
//             <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-6 lg:mb-8 xl:mb-10 flex items-center gap-2">
//               <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
//               Verification Progress
//             </h3>

//             <div className="space-y-4 lg:space-y-5 xl:space-y-6">
//               {/* Step 1: Buyer Agent */}
//               <div
//                 className="p-6 lg:p-8 xl:p-10 rounded-lg border-2 transition-all"
//                 style={{
//                   borderColor: buyerMyAgentFetched ? "#3b82f6" : "#e2e8f0",
//                   backgroundColor: buyerMyAgentFetched ? "#eff6ff" : "#f8fafc",
//                 }}
//               >
//                 <div className="flex gap-3 lg:gap-4 items-start justify-between">
//                   <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
//                     <div
//                       className={`flex-shrink-0 w-10 h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full flex items-center justify-center transition-colors ${buyerMyAgentFetched ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
//                         }`}
//                     >
//                       <Package className="w-5 h-5 lg:w-5.5 lg:h-5.5 xl:w-6 xl:h-6" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">Buyer Agent Card Fetched</p>
//                       <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">{buyerMyAgentFetched ? "Complete" : "Pending"}</p>
//                     </div>
//                   </div>
//                   {buyerMyAgentFetched && (
//                     <div className="flex-shrink-0">
//                       <Check className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Step 2: Seller Agent Fetched */}
//               <div
//                 className="p-6 lg:p-8 xl:p-10 rounded-lg border-2 transition-all"
//                 style={{
//                   borderColor: sellerAgentFetched ? "#9333ea" : "#e2e8f0",
//                   backgroundColor: sellerAgentFetched ? "#faf5ff" : "#f8fafc",
//                 }}
//               >
//                 <div className="flex gap-3 lg:gap-4 items-start justify-between">
//                   <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
//                     <div
//                       className={`flex-shrink-0 w-10 h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full flex items-center justify-center transition-colors ${sellerAgentFetched ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-600"
//                         }`}
//                     >
//                       <Package className="w-5 h-5 lg:w-5.5 lg:h-5.5 xl:w-6 xl:h-6" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">Seller Agent Card Fetched</p>
//                       <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">{sellerAgentFetched ? "Complete" : "Pending"}</p>
//                     </div>
//                   </div>
//                   {sellerAgentFetched && (
//                     <div className="flex-shrink-0">
//                       <Check className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Step 3: Seller Agent Verified */}
//               <div
//                 className="p-6 lg:p-8 xl:p-10 rounded-lg border-2 transition-all"
//                 style={{
//                   borderColor: sellerAgentVerified ? "#22c55e" : "#e2e8f0",
//                   backgroundColor: sellerAgentVerified ? "#f0fdf4" : "#f8fafc",
//                 }}
//               >
//                 <div className="flex gap-3 lg:gap-4 items-start justify-between">
//                   <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
//                     <div
//                       className={`flex-shrink-0 w-10 h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full flex items-center justify-center transition-colors ${sellerAgentVerified ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-600"
//                         }`}
//                     >
//                       <Shield className="w-5 h-5 lg:w-5.5 lg:h-5.5 xl:w-6 xl:h-6" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">Seller Agent Card Verified by Buyer</p>
//                       <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">{sellerAgentVerified ? "Complete" : "Pending"}</p>
//                       {sellerAgentVerified && (
//                         <div className="mt-3 lg:mt-4 text-xs lg:text-sm text-slate-700 space-y-2 lg:space-y-3">
//                           <p>
//                             <strong className="font-semibold">Validation Successful:</strong> The{" "}
//                             <span className="font-semibold">{sellerAgentData?.alias}</span> is validated for delegation
//                             from its OOR holder.
//                           </p>
//                           <a
//                             href="http://localhost:3902/identifiers/EGNlvZ3YwQ4BKsZm1Dvqyy9WbN2dQgDuyhXEXwo8TXYR"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline break-all"
//                           >
//                             View Identifier Details
//                             <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   {sellerAgentVerified && (
//                     <div className="flex-shrink-0">
//                       <Check className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Step 4: Buyer Agent Verified */}
//               <div
//                 className="p-6 lg:p-8 xl:p-10 rounded-lg border-2 transition-all"
//                 style={{
//                   borderColor: buyerAgentVerified ? "#f97316" : "#e2e8f0",
//                   backgroundColor: buyerAgentVerified ? "#fff7ed" : "#f8fafc",
//                 }}
//               >
//                 <div className="flex gap-3 lg:gap-4 items-start justify-between">
//                   <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
//                     <div
//                       className={`flex-shrink-0 w-10 h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full flex items-center justify-center transition-colors ${buyerAgentVerified ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-600"
//                         }`}
//                     >
//                       <Shield className="w-5 h-5 lg:w-5.5 lg:h-5.5 xl:w-6 xl:h-6" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">Buyer Agent Card Verified by Seller</p>
//                       <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">{buyerAgentVerified ? "Complete" : "Pending"}</p>
//                       {buyerAgentVerified && (
//                         <div className="mt-3 lg:mt-4 text-xs lg:text-sm text-slate-700 space-y-2 lg:space-y-3">
//                           <p>
//                             <strong className="font-semibold">Validation Successful:</strong> The{" "}
//                             <span className="font-semibold">{buyerAgentData?.alias}</span> is validated for delegation
//                             from its OOR holder.
//                           </p>
//                           <a
//                             href="http://localhost:3902/identifiers/EGNlvZ3YwQ4BKsZm1Dvqyy9WbN2dQgDuyhXEXwo8TXYR"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline break-all"
//                           >
//                             View Identifier Details
//                             <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   {buyerAgentVerified && (
//                     <div className="flex-shrink-0">
//                       <Check className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Final Step: Trust Established */}
//               <div
//                 className="p-6 lg:p-8 xl:p-10 rounded-lg border-2 transition-all"
//                 style={{
//                   borderColor: sellerAgentVerified && buyerAgentVerified ? "#4f46e5" : "#e2e8f0",
//                   backgroundColor: sellerAgentVerified && buyerAgentVerified ? "#eef2ff" : "#f8fafc",
//                 }}
//               >
//                 <div className="flex gap-3 lg:gap-4 items-start justify-between">
//                   <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
//                     <div
//                       className={`flex-shrink-0 w-10 h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full flex items-center justify-center transition-colors ${sellerAgentVerified && buyerAgentVerified
//                         ? "bg-indigo-100 text-indigo-600"
//                         : "bg-slate-100 text-slate-600"
//                         }`}
//                     >
//                       <Lock className="w-5 h-5 lg:w-5.5 lg:h-5.5 xl:w-6 xl:h-6" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">Trust Established</p>
//                       <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">
//                         {sellerAgentVerified && buyerAgentVerified ? "vLEI Verified" : "Pending All Verifications"}
//                       </p>
//                     </div>
//                   </div>
//                   {sellerAgentVerified && buyerAgentVerified && (
//                     <div className="flex-shrink-0">
//                       <Check className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* GROUP 3: BUYER AGENT + SELLER ORGANIZATION (UNIFIED CONTAINER - SIDE BY SIDE) */}
//           <div className="border border-slate-300 rounded-xl shadow-sm overflow-hidden bg-white">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-full">
//               {/* LEFT COLUMN: Buyer Agent Card Section */}
//               <div className="bg-white min-h-[200px] border-b md:border-b-0">
//                 {showBuyerAgentColumn && (
//                   <div className="p-6 lg:p-8 animate-fade-in-up h-full">
//                     <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
//                       <User className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
//                       Buyer Agent Card
//                     </h3>

//                     {!selectedBuyer && (
//                       <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
//                         {BUYERS_LIST.map((buyer) => (
//                           <div
//                             key={buyer.id}
//                             onClick={() => {
//                               setSelectedBuyer(buyer.id)
//                               setBuyerAgentFetched(false)
//                               setBuyerAgentVerified(false)
//                             }}
//                             className="p-3 lg:p-4 border-2 border-slate-200 bg-slate-50 hover:border-orange-300 rounded-lg cursor-pointer transition-colors"
//                           >
//                             <p className="font-medium text-xs lg:text-sm text-slate-900 break-words">{buyer.name}</p>
//                             <p className="text-[10px] lg:text-xs text-slate-500 break-all">{buyer.lei}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {selectedBuyer && !buyerAgentFetched && (
//                       <button
//                         onClick={handleFetchBuyerAgent}
//                         disabled={buyerAgentLoading}
//                         className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2 mb-4 lg:mb-6"
//                       >
//                         {buyerAgentLoading ? (
//                           <>
//                             <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
//                             Fetching Buyer Agent...
//                           </>
//                         ) : (
//                           <>
//                             <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
//                             Get Buyer Agent
//                           </>
//                         )}
//                       </button>
//                     )}

//                     {buyerAgentFetched && buyerAgentData && (
//                       <div className="p-4 lg:p-6 bg-orange-50 border border-orange-200 rounded-lg mb-4 lg:mb-6 animate-scale-in">
//                         <div className="flex items-start justify-between mb-3 lg:mb-4">
//                           <h4 className="text-sm lg:text-base font-semibold text-slate-900">Agent Card</h4>
//                           <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 animate-checkmark-bounce flex-shrink-0" />
//                         </div>
//                         <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-700">
//                           <p>
//                             <strong className="font-semibold">Alias:</strong> <span className="break-words">{buyerAgentData.alias}</span>
//                           </p>
//                           <p>
//                             <strong className="font-semibold">Role:</strong>{" "}
//                             <span className="break-words">{buyerAgentData.engagementContextRole}</span>
//                           </p>
//                           <p>
//                             <strong className="font-semibold">Type:</strong> <span className="break-words">{buyerAgentData.agentType}</span>
//                           </p>
//                           <p className="text-[10px] lg:text-xs text-slate-500 pt-2 lg:pt-3">Fetched at: {buyerAgentData.timestamp}</p>
//                         </div>
//                       </div>
//                     )}

//                     {buyerAgentFetched && !buyerAgentVerified && (
//                       <button
//                         onClick={handleVerifyBuyerAgent}
//                         disabled={buyerAgentVerifying}
//                         className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
//                       >
//                         {buyerAgentVerifying ? (
//                           <>
//                             <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
//                             Verifying...
//                           </>
//                         ) : (
//                           <>
//                             <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
//                             Verify the Buyer Agent Card
//                           </>
//                         )}
//                       </button>
//                     )}

//                     {buyerAgentVerified && buyerVerificationChain && (
//                       <div className="mt-4 lg:mt-6 p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg animate-fade-in-up animate-color-transition">
//                         <div className="flex items-center gap-2 mb-3 lg:mb-4">
//                           <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 animate-pulse-glow flex-shrink-0" />
//                           <p className="text-xs lg:text-sm font-semibold text-green-700">Buyer Agent Card Verified by Seller</p>
//                         </div>
//                         <div className="text-xs lg:text-sm text-slate-700 space-y-2 lg:space-y-4 pl-6 lg:pl-7">
//                           <p>
//                             <strong className="font-semibold">Validation Successful:</strong> The{" "}
//                             <span className="font-semibold">{buyerAgentData?.alias}</span> is validated for delegation
//                             from its OOR holder.
//                           </p>
//                           <a
//                             href="http://localhost:3902/identifiers/EGNlvZ3YwQ4BKsZm1Dvqyy9WbN2dQgDuyhXEXwo8TXYR"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline break-all"
//                           >
//                             View Identifier Details
//                             <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
//                           </a>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* RIGHT COLUMN: Seller Organization + Seller My Agent + Fetch Button */}
//               <div className="border-t md:border-t-0 md:border-l border-slate-300 bg-white">
//                 {/* Seller Organization */}
//                 <div className="p-6 lg:p-8 border-b border-slate-300 animate-slide-in-right">
//                   <div className="flex items-start gap-3 lg:gap-4">
//                     <div
//                       className="bg-green-100 p-2.5 lg:p-3 rounded-lg flex-shrink-0 animate-gentle-spin"
//                       style={{ animationDuration: "4s" }}
//                     >
//                       <Building className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h2 className="text-base lg:text-lg font-semibold text-slate-900 mb-2 lg:mb-3">Seller Organization</h2>
//                       <p className="text-sm lg:text-base text-slate-700 font-medium mb-2 break-words">{LEI_DATA.jupiter.name}</p>
//                       <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-600">
//                         <p>
//                           <strong className="font-semibold">LEI:</strong> <span className="break-all">{LEI_DATA.jupiter.lei}</span>
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Address:</strong> <span className="break-words">{LEI_DATA.jupiter.address}</span>
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Website:</strong>{" "}
//                           <a
//                             href={LEI_DATA.jupiter.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-green-600 hover:underline break-all inline-block"
//                           >
//                             {LEI_DATA.jupiter.url}
//                           </a>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Seller My Agent */}
//                 <div className="p-6 lg:p-8 border-b border-slate-300">
//                   <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
//                     <User className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
//                     My Agent Card
//                   </h3>

//                   {!sellerMyAgentFetched && (
//                     <button
//                       onClick={handleFetchSellerMyAgent}
//                       disabled={sellerMyAgentLoading}
//                       className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
//                     >
//                       {sellerMyAgentLoading ? (
//                         <>
//                           <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
//                           Fetching My Agent...
//                         </>
//                       ) : (
//                         <>
//                           <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
//                           Fetch My Agent Card
//                         </>
//                       )}
//                     </button>
//                   )}

//                   {sellerMyAgentFetched && sellerMyAgentData && (
//                     <div className="p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg animate-scale-in">
//                       <div className="flex items-start justify-between mb-3 lg:mb-4">
//                         <h4 className="text-sm lg:text-base font-semibold text-slate-900">Agent Card</h4>
//                         <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 animate-checkmark-bounce flex-shrink-0" />
//                       </div>
//                       <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-700">
//                         <p>
//                           <strong className="font-semibold">Alias:</strong> <span className="break-words">{sellerMyAgentData.alias}</span>
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Role:</strong>{" "}
//                           <span className="break-words">{sellerMyAgentData.engagementContextRole}</span>
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Type:</strong> <span className="break-words">{sellerMyAgentData.agentType}</span>
//                         </p>
//                         <p className="text-[10px] lg:text-xs text-slate-500 pt-2 lg:pt-3">Fetched at: {sellerMyAgentData.timestamp}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Fetch Buyer Agent Button */}
//                 {sellerMyAgentFetched && (
//                   <div className="p-6 lg:p-8">
//                     <button
//                       onClick={() => setShowBuyerAgentColumn(!showBuyerAgentColumn)}
//                       className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
//                       Fetch Buyer Agent Card
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
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
  AlertCircle,
} from "lucide-react"

// ============================================
// VERIFICATION MODE CONFIGURATION
// ============================================
// Set to 'true' for MOCK verification (instant, always succeeds)
// Set to 'false' for REAL verification (requires API server running)
const USE_MOCK_VERIFICATION = false

// API Configuration - UPDATE THIS WITH YOUR LINUX MACHINE IP
// Only used when USE_MOCK_VERIFICATION = false
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface AgentCard {
  alias: string
  engagementContextRole: string
  agentType: string
  verified?: boolean
  timestamp?: string
}

const AGENT_CARDS = {
  tommyBuyerAgent: {
    alias: "tommy buyer agent",
    engagementContextRole: "Buyer Agent",
    agentType: "AI",
    legalName: "Chief Procurement Officer",
    officialRole: "ChiefProcurementOfficer",
  },
  jupiterSellerAgent: {
    alias: "jupiter seller agent",
    engagementContextRole: "Seller Agent",
    agentType: "AI",
    legalName: "Chief Sales Officer",
    officialRole: "ChiefSalesOfficer",
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
  // BUYER SIDE - Own Agent
  const [buyerAgentFetched, setBuyerAgentFetched] = useState(false)
  const [buyerAgentData, setBuyerAgentData] = useState<AgentCard | null>(null)
  const [buyerAgentLoading, setBuyerAgentLoading] = useState(false)

  // BUYER SIDE - Seller Agent (cross-verification)
  const [sellerAgentFromBuyerFetched, setSellerAgentFromBuyerFetched] = useState(false)
  const [sellerAgentFromBuyerData, setSellerAgentFromBuyerData] = useState<AgentCard | null>(null)
  const [sellerAgentFromBuyerLoading, setSellerAgentFromBuyerLoading] = useState(false)
  const [sellerAgentVerifying, setSellerAgentVerifying] = useState(false)
  const [sellerAgentVerified, setSellerAgentVerified] = useState(false)

  // SELLER SIDE - Own Agent
  const [sellerAgentFetched, setSellerAgentFetched] = useState(false)
  const [sellerAgentData, setSellerAgentData] = useState<AgentCard | null>(null)
  const [sellerAgentLoading, setSellerAgentLoading] = useState(false)

  // SELLER SIDE - Buyer Agent (cross-verification)
  const [buyerAgentFromSellerFetched, setBuyerAgentFromSellerFetched] = useState(false)
  const [buyerAgentFromSellerData, setBuyerAgentFromSellerData] = useState<AgentCard | null>(null)
  const [buyerAgentFromSellerLoading, setBuyerAgentFromSellerLoading] = useState(false)
  const [buyerAgentVerifying, setBuyerAgentVerifying] = useState(false)
  const [buyerAgentVerified, setBuyerAgentVerified] = useState(false)

  const handleFetchBuyerAgent = async () => {
    setBuyerAgentLoading(true)
    setTimeout(() => {
      const agentCard: AgentCard = {
        ...AGENT_CARDS.tommyBuyerAgent,
        verified: true,
        timestamp: new Date().toLocaleTimeString(),
      }
      setBuyerAgentData(agentCard)
      setBuyerAgentFetched(true)
      setBuyerAgentLoading(false)
    }, 2000)
  }

  const handleFetchSellerAgentFromBuyer = async () => {
    setSellerAgentFromBuyerLoading(true)
    setTimeout(() => {
      const agentCard: AgentCard = {
        ...AGENT_CARDS.jupiterSellerAgent,
        verified: true,
        timestamp: new Date().toLocaleTimeString(),
      }
      setSellerAgentFromBuyerData(agentCard)
      setSellerAgentFromBuyerFetched(true)
      setSellerAgentFromBuyerLoading(false)
    }, 2000)
  }

  const handleVerifySellerAgent = async () => {
    setSellerAgentVerifying(true)
    
    if (USE_MOCK_VERIFICATION) {
      // MOCK VERIFICATION (for testing UI without backend)
      console.log('🎭 Using MOCK verification (set USE_MOCK_VERIFICATION = false for real verification)')
      setTimeout(() => {
        setSellerAgentVerified(true)
        setSellerAgentVerifying(false)
        console.log('✅ MOCK verification completed')
      }, 2500)
      return
    }
    
    // REAL VERIFICATION (requires API server)
    try {
      console.log('🔐 Starting REAL seller agent verification...')
      
      const response = await fetch(`${API_BASE_URL}/api/verify/seller`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      console.log('Verification result:', result)
      
      if (result.success) {
        setSellerAgentVerified(true)
        console.log('✅ Seller agent verification PASSED')
      } else {
        console.error('❌ Seller agent verification FAILED:', result.error)
        alert(`Verification Failed: ${result.error || 'Unknown error'}\n\nPlease check:\n1. API server is running\n2. Docker containers are up\n3. Agents were created successfully`)
      }
    } catch (error) {
      console.error('❌ Error calling verification API:', error)
      alert(`Cannot connect to verification API.\n\nPlease ensure:\n1. API server is running on Linux\n2. Network connectivity is working\n3. CORS is enabled\n\nError: ${error.message}`)
    } finally {
      setSellerAgentVerifying(false)
    }
  }

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
      // MOCK VERIFICATION (for testing UI without backend)
      console.log('🎭 Using MOCK verification (set USE_MOCK_VERIFICATION = false for real verification)')
      setTimeout(() => {
        setBuyerAgentVerified(true)
        setBuyerAgentVerifying(false)
        console.log('✅ MOCK verification completed')
      }, 2500)
      return
    }
    
    // REAL VERIFICATION (requires API server)
    try {
      console.log('🔐 Starting REAL buyer agent verification...')
      
      const response = await fetch(`${API_BASE_URL}/api/verify/buyer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      console.log('Verification result:', result)
      
      if (result.success) {
        setBuyerAgentVerified(true)
        console.log('✅ Buyer agent verification PASSED')
      } else {
        console.error('❌ Buyer agent verification FAILED:', result.error)
        alert(`Verification Failed: ${result.error || 'Unknown error'}\n\nPlease check:\n1. API server is running\n2. Docker containers are up\n3. Agents were created successfully`)
      }
    } catch (error) {
      console.error('❌ Error calling verification API:', error)
      alert(`Cannot connect to verification API.\n\nPlease ensure:\n1. API server is running on Linux\n2. Network connectivity is working\n3. CORS is enabled\n\nError: ${error.message}`)
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

          {/* CONTAINER 1: BUYER ORGANIZATION */}
          <div className="border border-slate-300 rounded-xl shadow-sm overflow-hidden bg-white">
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

            {/* Buyer Agent Card */}
            <div className="bg-white p-6 lg:p-8 border-b border-slate-300">
              <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                My Agent Card
              </h3>

              {!buyerAgentFetched && (
                <button
                  onClick={handleFetchBuyerAgent}
                  disabled={buyerAgentLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {buyerAgentLoading ? (
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

              {buyerAgentFetched && buyerAgentData && (
                <div className="p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3 lg:mb-4">
                    <h4 className="text-sm lg:text-base font-semibold text-slate-900">Agent Card</h4>
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 flex-shrink-0" />
                  </div>
                  <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-700">
                    <p>
                      <strong className="font-semibold">Alias:</strong>{" "}
                      <span className="break-words">{buyerAgentData.alias}</span>
                    </p>
                    <p>
                      <strong className="font-semibold">Role:</strong>{" "}
                      <span className="break-words">{buyerAgentData.engagementContextRole}</span>
                    </p>
                    <p>
                      <strong className="font-semibold">Type:</strong>{" "}
                      <span className="break-words">{buyerAgentData.agentType}</span>
                    </p>
                    <p className="text-[10px] lg:text-xs text-slate-500 pt-2 lg:pt-3">
                      Fetched at: {buyerAgentData.timestamp}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Fetch Seller Agent Section */}
            {buyerAgentFetched && (
              <div className="bg-white p-6 lg:p-8">
                <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
                  <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                  Seller Agent Card
                </h3>

                {!sellerAgentFromBuyerFetched && (
                  <button
                    onClick={handleFetchSellerAgentFromBuyer}
                    disabled={sellerAgentFromBuyerLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {sellerAgentFromBuyerLoading ? (
                      <>
                        <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
                        Fetching Seller Agent...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        Fetch Seller Agent Card
                      </>
                    )}
                  </button>
                )}

                {sellerAgentFromBuyerFetched && sellerAgentFromBuyerData && (
                  <>
                    <div className="p-4 lg:p-6 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                      <div className="flex items-start justify-between mb-3 lg:mb-4">
                        <h4 className="text-sm lg:text-base font-semibold text-slate-900">Agent Card</h4>
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 flex-shrink-0" />
                      </div>
                      <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-slate-700">
                        <p>
                          <strong className="font-semibold">Alias:</strong>{" "}
                          <span className="break-words">{sellerAgentFromBuyerData.alias}</span>
                        </p>
                        <p>
                          <strong className="font-semibold">Role:</strong>{" "}
                          <span className="break-words">{sellerAgentFromBuyerData.engagementContextRole}</span>
                        </p>
                        <p>
                          <strong className="font-semibold">Type:</strong>{" "}
                          <span className="break-words">{sellerAgentFromBuyerData.agentType}</span>
                        </p>
                        <p className="text-[10px] lg:text-xs text-slate-500 pt-2 lg:pt-3">
                          Fetched at: {sellerAgentFromBuyerData.timestamp}
                        </p>
                      </div>
                    </div>

                    {!sellerAgentVerified && (
                      <button
                        onClick={handleVerifySellerAgent}
                        disabled={sellerAgentVerifying}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {sellerAgentVerifying ? (
                          <>
                            <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            Verify Seller Agent Card
                          </>
                        )}
                      </button>
                    )}

                    {sellerAgentVerified && (
                      <div className="p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 flex-shrink-0" />
                          <p className="text-xs lg:text-sm font-semibold text-green-700">
                            Seller Agent Verified by Buyer
                          </p>
                        </div>
                        <div className="text-xs lg:text-sm text-slate-700 space-y-2">
                          <p>
                            <strong className="font-semibold">Validation Successful:</strong> The{" "}
                            <span className="font-semibold">{sellerAgentFromBuyerData?.alias}</span> is validated.
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

          {/* CONTAINER 2: VERIFICATION PROGRESS */}
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
                  borderColor: buyerAgentFetched ? "#3b82f6" : "#e2e8f0",
                  backgroundColor: buyerAgentFetched ? "#eff6ff" : "#f8fafc",
                }}
              >
                <div className="flex gap-3 lg:gap-4 items-start justify-between">
                  <div className="flex gap-3 lg:gap-4 items-start flex-1 min-w-0">
                    <div
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors ${buyerAgentFetched ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      <Package className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm lg:text-base font-semibold text-slate-900 break-words">
                        Buyer Agent Card Fetched
                      </p>
                      <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">
                        {buyerAgentFetched ? "Complete" : "Pending"}
                      </p>
                    </div>
                  </div>
                  {buyerAgentFetched && (
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
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors ${sellerAgentFetched ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-600"
                        }`}
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
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors ${sellerAgentVerified ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-600"
                        }`}
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
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors ${buyerAgentVerified ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-600"
                        }`}
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
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors ${sellerAgentVerified && buyerAgentVerified
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

          {/* CONTAINER 3: SELLER ORGANIZATION */}
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