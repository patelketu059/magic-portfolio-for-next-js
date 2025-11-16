import { NextResponse } from 'next/server';
import { getPosts } from '@/utils/utils';

export async function GET(request: Request) {
  try {
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
