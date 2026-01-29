import { NextResponse } from 'next/server'
import pdf from 'pdf-parse'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('pdf')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const data = await pdf(buffer)
    const text = data.text

    return NextResponse.json({ text })
  } catch (error) {
    console.error('PDF extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 }
    )
  }
}
