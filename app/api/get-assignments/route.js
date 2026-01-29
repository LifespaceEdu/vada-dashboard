import { NextResponse } from 'next/server'

// This endpoint will be called by Vada app to get assignment instructions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    // TODO: Replace with actual storage lookup
    // For now, this won't work until we add Vercel KV or database
    // But it shows the structure Vada will use

    return NextResponse.json(
      { error: 'Assignment not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Get assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignment' },
      { status: 500 }
    )
  }
}
