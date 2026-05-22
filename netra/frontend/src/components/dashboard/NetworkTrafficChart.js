"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useContext } from 'react';
import { LogDataContext } from '@/src/components/contexts/LogDataProvider';

export default function ThreatChart() {
  const { logTableData } = useContext(LogDataContext);
  
  // Aggregate by protocol
  const chartData = Object.entries(
    logTableData.reduce((acc, log) => {
      acc[log.protocol] = (acc[log.protocol] || 0) + 1;
      return acc;
    }, {})
  ).map(([protocol, count]) => ({ protocol, count }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="protocol" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}