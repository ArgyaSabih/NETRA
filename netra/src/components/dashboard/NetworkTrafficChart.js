"use client";

import {useState, useEffect} from "react";
import {FiZoomIn, FiZoomOut} from "react-icons/fi";
import {useNetworkTrafficData} from "@/src/hooks/useDashboard";

export default function NetworkTrafficChart() {
  const {data: chartData} = useNetworkTrafficData();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxValue = Math.max(...chartData.map((d) => d.normal + d.suspicious + d.critical));

  return (
    <div className="p-6 rounded-lg border border-slate-700/50 bg-slate-800/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-slate-500 rounded-full"></span>
          Network Traffic Volume
        </h2>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <FiZoomIn size={18} className="text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <FiZoomOut size={18} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="h-64 flex items-flex-end gap-3 px-4">
        {chartData.map((data, index) => {
          const totalValue = data.normal + data.suspicious + data.critical;
          const normalPercent = (data.normal / totalValue) * 100;
          const suspiciousPercent = (data.suspicious / totalValue) * 100;
          const criticalPercent = (data.critical / totalValue) * 100;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-full rounded-t-lg relative transition-all"
                style={{
                  height: `${(totalValue / maxValue) * 200}px`,
                  backgroundColor: hoveredIndex === index ? "#64748b" : "#334155"
                }}
              >
                <div
                  className="absolute bottom-0 w-full bg-red-500/70 transition-all"
                  style={{
                    height: `${(criticalPercent / 100) * ((totalValue / maxValue) * 200)}px`
                  }}
                ></div>
                <div
                  className="absolute bottom-0 w-full bg-yellow-500/50 transition-all"
                  style={{
                    height: `${
                      (suspiciousPercent / 100) * ((totalValue / maxValue) * 200) +
                      (criticalPercent / 100) * ((totalValue / maxValue) * 200)
                    }px`
                  }}
                ></div>
              </div>

              {hoveredIndex === index && <div className="text-xs text-slate-400">{data.hour}</div>}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-slate-400">Authorized Traffic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-xs text-slate-400">Suspicious Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs text-slate-400">Critical Attack</span>
        </div>
      </div>
    </div>
  );
}
