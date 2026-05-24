'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'

const FALLBACK_IDS = {
  tamires: 'tamires-local',
  mizael: 'mizael-local',
}

export default function SelectProfile() {
  const router = useRouter()
  const { activeProfile, setActiveProfile } = useProfileStore()
  const [loading, setLoading] = useState<'tamires' | 'mizael' | null>(null)

  useEffect(() => {
    if (activeProfile) router.replace('/home')
  }, [activeProfile, router])

  async function selectProfile(name: 'tamires' | 'mizael') {
    setLoading(name)
    const displayName = name === 'tamires' ? 'Tamires' : 'Mizael'

    try {
      let { data: profile } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('name', displayName)
        .single()

      if (!profile) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            name: displayName,
            age: name === 'tamires' ? 28 : 30,
            weight_kg: name === 'tamires' ? 60 : 85,
            height_cm: name === 'tamires' ? 165 : 175,
            goal: name === 'tamires' ? 'Definição muscular e saúde' : 'Perda de gordura e saúde metabólica',
            protein_goal_g: name === 'tamires' ? 128 : 150,
            color_primary: name === 'tamires' ? '#E91E8C' : '#FFFFFF',
          })
          .select()
          .single()
        profile = newProfile
      }

      const id = profile?.id ?? FALLBACK_IDS[name]
      setActiveProfile(name, id)
      router.push('/home')
    } catch {
      // Supabase not configured yet — use local mode
      setActiveProfile(name, FALLBACK_IDS[name])
      router.push('/home')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="mb-10 text-center">
        <div className="text-5xl mb-3">🏋️</div>
        <h1 className="text-3xl font-bold text-white">TaMiza Fit</h1>
        <p className="text-[#888] mt-2 text-sm">Escolha seu perfil para começar</p>
      </div>

      <div className="w-full space-y-4">
        <button
          onClick={() => selectProfile('tamires')}
          disabled={loading !== null}
          className="w-full rounded-3xl p-6 text-left active:scale-95 transition-transform disabled:opacity-70 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #E91E8C, #FF6EB4)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              🌸
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Tamires</p>
              <p className="text-white/70 text-sm">28 anos • Definição muscular</p>
            </div>
          </div>
          {loading === 'tamires' && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </button>

        <button
          onClick={() => selectProfile('mizael')}
          disabled={loading !== null}
          className="w-full rounded-3xl p-6 text-left active:scale-95 transition-transform disabled:opacity-70 relative overflow-hidden bg-[#1A1A1A] border-2 border-white/20"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">
              ⚫
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Mizael</p>
              <p className="text-[#888] text-sm">30 anos • Saúde metabólica</p>
            </div>
          </div>
          {loading === 'mizael' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
