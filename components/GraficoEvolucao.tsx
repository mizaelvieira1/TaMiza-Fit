'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useProfileStore } from '@/store/profileStore'

interface DataPoint {
  date: string
  value: number
}

interface GraficoEvolucaoProps {
  data: DataPoint[]
  label: string
  unit?: string
  goal?: number
  color?: string
}

export function GraficoEvolucao({ data, label, unit = 'kg', goal, color }: GraficoEvolucaoProps) {
  const { activeProfile } = useProfileStore()
  const lineColor = color || (activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF')

  if (data.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] flex items-center justify-center">
        <p className="text-[#888] text-sm text-center">Sem dados suficientes ainda.<br />Complete mais treinos para ver a evolução.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
      <h4 className="text-sm font-medium text-white mb-3">{label}</h4>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
          <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} />
          <YAxis tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8 }}
            labelStyle={{ color: '#888', fontSize: 11 }}
            itemStyle={{ color: lineColor, fontSize: 12 }}
            formatter={(v) => [`${v}${unit}`, label]}
          />
          {goal && (
            <ReferenceLine y={goal} stroke="#27AE60" strokeDasharray="4 4" label={{ value: `Meta ${goal}${unit}`, fill: '#27AE60', fontSize: 10 }} />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2.5}
            dot={{ fill: lineColor, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
