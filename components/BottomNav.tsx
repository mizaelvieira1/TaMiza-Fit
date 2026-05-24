'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, Salad, TrendingUp } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'

const tabs = [
  { href: '/home', label: 'Início', Icon: Home },
  { href: '/treino', label: 'Treino', Icon: Dumbbell },
  { href: '/alimentacao', label: 'Alimentação', Icon: Salad },
  { href: '/evolucao', label: 'Evolução', Icon: TrendingUp },
]

export function BottomNav() {
  const pathname = usePathname()
  const { activeProfile } = useProfileStore()
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-[#1A1A1A] border-t border-[#2A2A2A] z-50">
      <div className="flex items-center justify-around h-16 pb-safe">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 flex-1 py-2"
            >
              <Icon
                size={22}
                style={{ color: active ? color : '#666666' }}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? color : '#666666' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
