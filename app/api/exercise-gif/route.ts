import { NextResponse } from 'next/server'

// Cache server-side para não buscar o mesmo exercício várias vezes
const serverCache: Record<string, { url: string | null; isVideo: boolean }> = {}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) return NextResponse.json({ url: null, isVideo: false })

  // Retorna do cache se já buscou antes
  if (serverCache[slug] !== undefined) {
    return NextResponse.json(serverCache[slug])
  }

  try {
    const pageUrl = `https://muscles.wiki/${slug}/`
    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 86400 }, // cache Next.js por 24h
    })

    if (!res.ok) {
      serverCache[slug] = { url: null, isVideo: false }
      return NextResponse.json({ url: null, isVideo: false })
    }

    const html = await res.text()

    // 1. Tenta OG image (mais confiável — é o que o site define explicitamente)
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)

    // 2. Tenta GIF direto
    const gifMatch = html.match(/https?:\/\/[^\s"'<>]+\.gif/i)

    // 3. Tenta vídeo MP4 (muscles.wiki às vezes usa vídeo em vez de GIF)
    const mp4Match = html.match(/https?:\/\/[^\s"'<>]+muscles\.wiki[^\s"'<>]+\.mp4/i)
      || html.match(/<source[^>]+src=["']([^"']+\.mp4)["']/i)

    const url = gifMatch?.[0] || ogMatch?.[1] || mp4Match?.[1] || mp4Match?.[0] || null
    const isVideo = !!url && (url.endsWith('.mp4') || url.includes('.mp4'))

    const result = { url, isVideo }
    serverCache[slug] = result
    return NextResponse.json(result)
  } catch {
    serverCache[slug] = { url: null, isVideo: false }
    return NextResponse.json({ url: null, isVideo: false })
  }
}
