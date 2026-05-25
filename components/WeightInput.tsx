'use client'
import { useState } from 'react'
import { Scale } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import { getLocalDate } from '@/lib/dateUtils'

interface WeightInputProps {
  history: { date: string; value: number }[]
  todayWeight: number | null
  todayLogId: string | null
  goalWeight?: number
  onSaved: (kg: number, id: string) => void
}

export function WeightInput({ history, todayWeight, todayLogId, goalWeight, onSaved }: WeightInputProps) {
  const { profileId, activeProfile } = useProfileStore()
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'

  const [kg, setKg] = useState<number>(todayWeight ?? 0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(!!todayWeight)
  const [saveError, setSaveError] = useState<string | null>(null)

  function adjust(delta: number) {
    setKg(prev => Math.max(0, Math.round((prev + delta) * 10) / 10))
    setSaved(false)
    setSaveError(null)
  }

  async function save() {
    if (!profileId || kg <= 0 || saving) return
    setSaving(true)
    setSaveError(null)
    const today = getLocalDate()

    if (todayLogId) {
      const { error } = await supabase
        .from('weight_logs')
        .update({ weight_kg: kg })
        .eq('id', todayLogId)
      if (error) { setSaveError('Erro ao salvar. Execute o SQL de migração no Supabase.'); setSaving(false); return }
      onSaved(kg, todayLogId)
    } else {
      const { data, error } = await supabase
        .from('weight_logs')
        .insert({ profile_id: profileId, logged_date: today, weight_kg: kg })
        .select()
        .single()
      if (error || !data) { setSaveError('Tabela não encontrada. Execute o SQL de migração no Supabase.'); setSaving(false); return }
      onSaved(kg, data.id)
    }

    setSaved(true)
    setSaving(false)
  }

  const lastWeight = history.length > 1 ? history[history.length - 2]?.value : null
  const diff = lastWeight && todayWeight ? +(todayWeight - lastWeight).toFixed(1) : null
  const hasChart = history.length >= 2

  return (
    <div className="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Scale size={16} style={{ color }} />
          <span className="text-sm font-semibold text-white">Peso Corporal</span>
        </div>
        {diff !== null && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            diff < 0 ? 'text-[#27AE60] bg-[#27AE60]/10' :
            diff > 0 ? 'text-[#E67E22] bg-[#E67E22]/10' :
                       'text-[#888] bg-[#2A2A2A]'
          }`}>
            {diff > 0 ? '+' : ''}{diff} kg vs anterior
          </span>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => adjust(-0.1)}
            className="w-10 h-10 rounded-xl bg-[#2A2A2A] text-white text-lg font-bold flex items-center justify-center active:scale-90 transition-transform"
          >−</button>

          <div className="flex-1 relative">
            <input
              type="number"
              step="0.1"
              min="0"
              value={kg || ''}
              placeholder="0.0"
              onChange={e => { setKg(parseFloat(e.target.value) || 0); setSaved(false); setSaveError(null) }}
              className="w-full bg-[#2A2A2A] rounded-xl text-center text-3xl font-bold text-white py-2.5 outline-none border border-[#3A3A3A] focus:border-white pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-sm">kg</span>
          </div>

          <button
            onClick={() => adjust(0.1)}
            className="w-10 h-10 rounded-xl bg-[#2A2A2A] text-white text-lg font-bold flex items-center justify-center active:scale-90 transition-transform"
          >+</button>
        </div>

        {saveError && (
          <p className="text-xs text-[#E74C3C] text-center mb-2 bg-[#E74C3C]/10 rounded-xl px-3 py-2">{saveError}</p>
        )}

        <button
          onClick={save}
          disabled={saving || kg <= 0}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
          style={{
            backgroundColor: saved ? '#27AE6022' : color,
            color: saved ? '#27AE60' : (activeProfile === 'tamires' ? '#fff' : '#000'),
            border: saved ? '1px solid #27AE6044' : 'none',
          }}
        >
          {saving ? 'Salvando…' : saved ? '✓ Salvo' : 'Salvar peso'}
        </button>
      </div>

      {/* Gráfico inline (sem card aninhado) */}
      {hasChart && (
        <div className="px-4 pb-4">
          <p className="text-xs text-[#888] mb-2">Evolução do peso</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} />
              <YAxis
                tick={{ fill: '#888', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip
                contentStyle={{ background: '#0F0F0F', border: '1px solid #2A2A2A', borderRadius: 8 }}
                labelStyle={{ color: '#888', fontSize: 11 }}
                itemStyle={{ color, fontSize: 12 }}
                formatter={(v: any) => [`${v} kg`, 'Peso']}
              />
              {goalWeight && (
                <ReferenceLine
                  y={goalWeight}
                  stroke="#27AE60"
                  strokeDasharray="4 4"
                  label={{ value: `Meta ${goalWeight}kg`, fill: '#27AE60', fontSize: 10, position: 'insideTopRight' }}
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                dot={{ fill: color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!hasChart && (
        <p className="text-xs text-[#555] text-center px-4 pb-4">
          Registre em dias diferentes para ver o gráfico de evolução
        </p>
      )}
    </div>
  )
}
