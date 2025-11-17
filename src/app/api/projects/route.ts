import { NextResponse } from 'next/server';
import { getPosts } from '@/utils/utils';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const excludeParam = url.searchParams.get('exclude') || '';
    const exclude = excludeParam ? excludeParam.split(',').map(s => s.trim()) : [];
    console.log('[DEBUG API] /api/projects called. excludeParam:', excludeParam, 'exclude array:', exclude);

    const posts = getPosts(['src', 'app', 'work', 'projects'])
      .filter(p => !exclude.includes(p.slug))
      .map(p => ({
        slug: p.slug,
        metadata: p.metadata,
        content: p.content,
      }));

    console.log('[DEBUG API] /api/projects returning posts count:', posts.length, 'sample slugs:', posts.slice(0,5).map(p=>p.slug));

    return NextResponse.json({ posts });
  } catch (err) {
    console.error('[DEBUG API] /api/projects error:', err);
    return NextResponse.json({ posts: [] });
  }
}
