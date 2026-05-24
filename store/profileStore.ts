'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ActiveProfile = 'tamires' | 'mizael' | null

interface ProfileState {
  activeProfile: ActiveProfile
  profileId: string | null
  setActiveProfile: (profile: ActiveProfile, id: string) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfile: null,
      profileId: null,
      setActiveProfile: (profile, id) => set({ activeProfile: profile, profileId: id }),
      clearProfile: () => set({ activeProfile: null, profileId: null }),
    }),
    { name: 'tamiza-profile' }
  )
)
