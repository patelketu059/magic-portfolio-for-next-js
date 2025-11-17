#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

const postsDir = path.join(process.cwd(), 'src', 'app', 'work', 'projects');
if (!fs.existsSync(postsDir)) {
  process.exit(0);
}

const files = fs.readdirSync(postsDir).filter(f => path.extname(f) === '.mdx');

const posts = files.map((file) => {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const { data, content } = matter(raw);
  return {
    slug: path.basename(file, path.extname(file)),
    metadata: {
      title: data.title || '',
      publishedAt: data.publishedAt || '',
      summary: data.summary || '',
      images: data.images || [],
      image: data.image || '',
      tag: data.tag || [],
      team: data.team || [],
      link: data.link || ''
    },
    content: content || ''
  };
});

const outDir = path.join(process.cwd(), 'public', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'posts.json'), JSON.stringify({ posts }, null, 2));
