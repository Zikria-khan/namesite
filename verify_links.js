const fs = require('fs');
const path = require('path');

// Load name databases
const islamicNames = require('./public/islamic_names.json').map(n => String(n).toLowerCase());
const christianNames = require('./public/christians_names.json').map(n => String(n).toLowerCase());
const hinduNames = require('./public/hindu_names.json').map(n => String(n).toLowerCase());

const islamicSet = new Set(islamicNames);
const christianSet = new Set(christianNames);
const hinduSet = new Set(hinduNames);

// Build sitemap slug sets
const sitemapDir = 'public';
const sitemapFiles = fs.readdirSync(sitemapDir).filter(f => 
  f.startsWith('sitemap-') && 
  f.endsWith('.xml') && 
  !f.includes('sitemap-pages') && 
  !f.includes('sitemap.xml') &&
  !f.includes('top_')
);

const sitemapSlugs = { islamic: new Set(), christian: new Set(), hindu: new Set() };

sitemapFiles.forEach(f => {
  const religionMatch = f.match(/sitemap-(islamic|christian|hindu)-names/);
  if (!religionMatch) return;
  const religion = religionMatch[1];
  const content = fs.readFileSync(path.join(sitemapDir, f), 'utf8');
  const regex = /<loc>https?:\/\/nameverse\.vercel\.app\/names\/(islamic|christian|hindu)\/([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    sitemapSlugs[religion].add(match[2].toLowerCase());
  }
});

function detectReligion(name) {
  const lower = String(name).toLowerCase().trim();
  if (islamicSet.has(lower)) return 'islamic';
  if (christianSet.has(lower)) return 'christian';
  if (hinduSet.has(lower)) return 'hindu';
  return 'islamic'; // fallback
}

function urlExistsInSitemap(religion, slug) {
  const lower = String(slug).toLowerCase().trim();
  if (religion === 'islamic') return sitemapSlugs.islamic.has(lower);
  if (religion === 'christian') return sitemapSlugs.christian.has(lower);
  if (religion === 'hindu') return sitemapSlugs.hindu.has(lower);
  return false;
}

// Load blog posts
const posts = JSON.parse(fs.readFileSync('public/data/blog-posts.json', 'utf8'));

console.log('=== VERIFICATION: Checking which names produce broken links ===\n');

const brokenLinks = [];
const validLinks = [];

posts.forEach(post => {
  if (post.content && post.content.sections) {
    post.content.sections.forEach(section => {
      if (!section.featuredNames) return;
      
      section.featuredNames.forEach(name => {
        if (typeof name === 'object' && name !== null) return; // Skip objects
        
        const nameStr = String(name || '').trim();
        if (!nameStr) return;
        
        const baseName = nameStr.replace(/\s*\(\d+\)$/, '').trim();
        if (!baseName) return;
        
        const blogReligion = getBlogReligion(post.category);
        const nameReligion = detectReligion(baseName);
        const finalReligion = blogReligion !== 'islamic' ? blogReligion :
                              nameReligion !== 'islamic' ? nameReligion : 'islamic';
        
        const slug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const exists = urlExistsInSitemap(finalReligion, slug);
        
        if (!exists) {
          brokenLinks.push({
            post: post.id,
            section: section.title,
            name: baseName,
            religion: finalReligion,
            slug: slug,
            url: `/names/${finalReligion}/${slug}`
          });
        } else {
          validLinks.push({
            post: post.id,
            name: baseName,
            religion: finalReligion,
            url: `/names/${finalReligion}/${slug}`
          });
        }
      });
    });
  }
});

console.log(`Total names checked: ${brokenLinks.length + validLinks.length}`);
console.log(`Valid links: ${validLinks.length}`);
console.log(`Broken links: ${brokenLinks.length}`);
console.log('\n=== BROKEN LINKS ===');
brokenLinks.forEach(b => {
  console.log(`  ${b.post} | ${b.section} | "${b.name}" → /names/${b.religion}/${b.slug}`);
});

function getBlogReligion(category) {
  const cat = String(category || '').toLowerCase();
  if (cat.includes('islamic') || cat.includes('muslim')) return 'islamic';
  if (cat.includes('christian') || cat.includes('biblical')) return 'christian';
  if (cat.includes('hindu') || cat.includes('vedic') || cat.includes('sanskrit')) return 'hindu';
  return 'islamic';
}
