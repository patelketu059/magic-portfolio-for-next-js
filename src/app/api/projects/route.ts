import { NextResponse } from 'next/server';
import { getPosts } from '@/utils/utils';
import fs from 'node:fs';
import path from 'node:path';

export async function GET(request: Request) {
  try {
    // Prefer static JSON generated at build time (public/data/posts.json)
    const dataFile = path.join(process.cwd(), 'public', 'data', 'posts.json');
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8');
      const parsed = JSON.parse(raw);
      return NextResponse.json(parsed);
    }

    const url = new URL(request.url);
    const excludeParam = url.searchParams.get('exclude') || '';
    const exclude = excludeParam ? excludeParam.split(',').map(s => s.trim()) : [];

    const posts = getPosts(['src', 'app', 'work', 'projects'])
      .filter(p => !exclude.includes(p.slug))
      .map(p => ({
        slug: p.slug,
        metadata: p.metadata,
        content: p.content,
      }));

    return NextResponse.json({ posts });
  } catch (err) {
    return NextResponse.json({ posts: [] });
  }
}
