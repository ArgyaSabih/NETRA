// "use client";

// export default function ThreatCategories({threats = []}) {
//   const defaultThreats = [
//     {name: "DDoS Attacks", percentage: 45, color: "bg-red-500"},
//     {name: "Bruteforce", percentage: 28, color: "bg-orange-500"},
//     {name: "Malware", percentage: 15, color: "bg-purple-500"},
//     {name: "Phishing", percentage: 12, color: "bg-blue-500"}
//   ];

//   const threatData = threats.length > 0 ? threats : defaultThreats;

//   return (
//     <div className="p-6 rounded-lg border border-slate-700/50 bg-slate-800/50">
//       <h2 className="text-lg font-semibold text-white mb-6">Threat Categories</h2>

//       <div className="space-y-4">
//         {threatData.map((threat, index) => (
//           <div key={index}>
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm text-slate-300">{threat.name}</span>
//               <span className="text-sm font-medium text-white">{threat.percentage}%</span>
//             </div>
//             <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
//               <div
//                 className={`h-full ${threat.color} transition-all`}
//                 style={{width: `${threat.percentage}%`}}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 pt-6 border-t border-slate-700/50">
//         <p className="text-xs text-slate-500 text-center">
//           Data updated in real-time from AI threat analysis
//         </p>
//       </div>
//     </div>
//   );
// }
