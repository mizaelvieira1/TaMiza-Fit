import { NextResponse } from 'next/server'
import { runSeed } from '@/lib/supabase-seed'

export async function GET() {
  try {
    const result = await runSeed()
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
