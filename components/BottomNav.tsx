'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, Salad, TrendingUp } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'

const tabs = [
  { href: '/home',        label: 'Início',       Icon: Home },
  { href: '/treino',      label: 'Treino',        Icon: Dumbbell },
  { href: '/alimentacao', label: 'Alimentação',   Icon: Salad },
  { href: '/evolucao',    label: 'Evolução',      Icon: TrendingUp },
]

export function BottomNav() {
  const pathname = usePathname()
  const { activeProfile } = useProfileStore()
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] border-t border-[#2A2A2A]"
    >
      {/* Área dos botões — altura fixa 64 px, não misturada com safe-area */}
      <div className="flex items-center justify-around h-16 max-w-[430px] mx-auto">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full min-w-0"
            >
              <Icon size={22} style={{ color: active ? color : '#666' }} />
              <span
                className="text-[10px] font-medium leading-none truncate w-full text-center px-1"
                style={{ color: active ? color : '#666' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Espaçador para safe-area (entalhe iPhone / Android) — fora da altura fixa */}
      <div className="pb-safe" />
    </nav>
  )
}
