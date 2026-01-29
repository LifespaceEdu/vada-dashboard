import { NextResponse } from 'next/server'

// In-memory storage for demo (replace with Vercel KV or database later)
let assignments = []

// GET - Fetch all assignments
export async function GET(request) {
  return NextResponse.json(assignments)
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

    // Check if code already exists
    if (assignments.find((a) => a.code === code.toUpperCase())) {
      return NextResponse.json(
        { error: 'Code already exists' },
        { status: 409 }
      )
    }

    const assignment = {
      code: code.toUpperCase(),
      instructions,
      createdAt: new Date().toISOString(),
    }

    assignments.push(assignment)

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

    const initialLength = assignments.length
    assignments = assignments.filter((a) => a.code !== code.toUpperCase())

    if (assignments.length === initialLength) {
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
