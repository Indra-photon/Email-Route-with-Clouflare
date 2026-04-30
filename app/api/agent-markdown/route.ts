import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const pagePath = request.nextUrl.searchParams.get('path') ?? '/'

  const filePath =
    pagePath === '/'
      ? path.join(process.cwd(), 'public', 'llms.txt')
      : path.join(process.cwd(), 'public', pagePath, 'llms.txt')

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const tokens = Math.ceil(content.length / 4)

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'x-markdown-tokens': String(tokens),
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new NextResponse('No markdown available for this page.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
