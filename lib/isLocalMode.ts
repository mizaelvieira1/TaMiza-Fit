export function isLocalMode(profileId: string | null): boolean {
  if (!profileId) return true
  return profileId === 'tamires-local' || profileId === 'mizael-local'
}
