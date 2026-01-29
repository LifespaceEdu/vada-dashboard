import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

// GET - Fetch all assignments
export async function GET(request) {
  try {
    const keys = await redis.keys('assignment:*')
    const assignments = []
    
    for (const key of keys) {
      const assignment = await redis.get(key)
      if (assignment) {
        assignments.push(assignment)
      }
    }
    
    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Get assignments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}

// POST - Create new assignment
export async function POST(request) {
  try {
    const { code, instructions } = await request.json()

    if (!code || !instructions) {
      return NextResponse.json(
        { error: 'Code and instructions are required' },
        { status: 400 }
      )
    }

    const upperCode = code.toUpperCase()
    
    // Check if code already exists
    const exists = await redis.exists(`assignment:${upperCode}`)
    if (exists) {
      return NextResponse.json(
        { error: 'Code already exists' },
        { status: 409 }
      )
    }

    const assignment = {
      code: upperCode,
      instructions,
      createdAt: new Date().toISOString(),
    }

    await redis.set(`assignment:${upperCode}`, assignment)

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Create assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}

// DELETE - Remove assignment by code
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const upperCode = code.toUpperCase()
    const result = await redis.del(`assignment:${upperCode}`)

    if (result === 0) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    )
  }
}
