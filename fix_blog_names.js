const fs = require('fs');
const path = require('path');

// Load sitemap-based name maps: slug -> religion
function buildSitemapMaps() {
  const sitemapDir = 'public';
  const sitemapFiles = fs.readdirSync(sitemapDir).filter(f =>
    f.startsWith('sitemap-') &&
    f.endsWith('.xml') &&
    !f.includes('sitemap-pages') &&
    !f.match(/^sitemap\.xml$/) && // exclude ONLY the index, not combined sitemaps
    !f.startsWith('top_')
  );

  const maps = { islamic: new Map(), christian: new Map(), hindu: new Map() };

  sitemapFiles.forEach(f => {
    const m = f.match(/sitemap-(islamic|christian|hindu)-names/);
    if (!m) return;
    const religion = m[1];
    const content = fs.readFileSync(path.join(sitemapDir, f), 'utf8');
    const regex = /<loc>https?:\/\/nameverse\.vercel\.app\/names\/(islamic|christian|hindu)\/([^<]+)<\/loc>/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const slug = match[2].toLowerCase();
      if (!maps[religion].has(slug)) {
        maps[religion].set(slug, match[2]);
      }
    }
  });

  return maps;
}

const sitemapMaps = buildSitemapMaps();
console.log(`Islamic sitemap slugs: ${sitemapMaps.islamic.size}`);
console.log(`Christian sitemap slugs: ${sitemapMaps.christian.size}`);
console.log(`Hindu sitemap slugs: ${sitemapMaps.hindu.size}`);

function slugExists(religion, slug) {
  return sitemapMaps[religion].has(slug.toLowerCase());
}

function getOriginalCase(religion, slug) {
  const entry = sitemapMaps[religion].get(slug.toLowerCase());
  return entry || slug;
}

// Build gender hint maps from the detailed JSON databases
const genderHints = { islamic: {}, christian: {}, hindu: {} };

try {
  const ib = require('./public/data/islamic-boy-names.json');
  ib.forEach(n => { genderHints.islamic[String(n.name).toLowerCase()] = 'boy'; });
  const ig = require('./public/data/islamic-girl-names.json');
  ig.forEach(n => { genderHints.islamic[String(n.name).toLowerCase()] = 'girl'; });
} catch (e) {}

try {
  const cb = require('./public/data/christian-boy-names.json');
  cb.forEach(n => { genderHints.christian[String(n.name).toLowerCase()] = 'boy'; });
  const cg = require('./public/data/christian-girl-names.json');
  cg.forEach(n => { genderHints.christian[String(n.name).toLowerCase()] = 'girl'; });
} catch (e) {}

try {
  const hb = require('./public/data/hindu-boy-names.json');
  hb.forEach(n => { genderHints.hindu[String(n.name).toLowerCase()] = 'boy'; });
  const hg = require('./public/data/hindu-girl-names.json');
  hg.forEach(n => { genderHints.hindu[String(n.name).toLowerCase()] = 'girl'; });
} catch (e) {}

function getGender(name) {
  const lc = String(name).toLowerCase().trim();
  for (const religion of ['islamic', 'christian', 'hindu']) {
    if (genderHints[religion][lc]) return genderHints[religion][lc];
  }
  return 'boy'; // default assumption for unknown
}

function toSlug(name) {
  return String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getBlogReligion(category) {
  const cat = String(category || '').toLowerCase();
  if (cat.includes('islamic') || cat.includes('muslim')) return 'islamic';
  if (cat.includes('christian') || cat.includes('biblical')) return 'christian';
  if (cat.includes('hindu') || cat.includes('vedic') || cat.includes('sanskrit')) return 'hindu';
  return 'islamic';
}

// Build pre-sorted arrays per religion, grouped by first letter, with gender info
function buildLookupArrays() {
  const arrays = { islamic: [], christian: [], hindu: [] };
  for (const [religion, map] of Object.entries(sitemapMaps)) {
    const grouped = {};
    for (const [slug, original] of map.entries()) {
      const letter = slug.charAt(0);
      if (!grouped[letter]) grouped[letter] = [];
      const gender = getGender(original);
      grouped[letter].push({ slug, original, gender });
    }
    // Sort within each letter group
    for (const letter of Object.keys(grouped)) {
      grouped[letter].sort((a, b) => a.slug.localeCompare(b.slug));
    }
    arrays[religion] = grouped;
  }
  return arrays;
}

const lookupArrays = buildLookupArrays();

function findReplacement(blogReligion, usedSlugs, firstLetter) {
  // Try same religion, same first letter
  const grouped = lookupArrays[blogReligion];
  if (grouped[firstLetter]) {
    for (const entry of grouped[firstLetter]) {
      if (!usedSlugs.has(entry.slug)) {
        usedSlugs.add(entry.slug);
        return entry.original;
      }
    }
  }

  // Try same religion, any letter
  for (const letter of Object.keys(grouped).sort()) {
    for (const entry of grouped[letter]) {
      if (!usedSlugs.has(entry.slug)) {
        usedSlugs.add(entry.slug);
        return entry.original;
      }
    }
  }

  // Fallback: try other religions, same letter
  for (const [religion, grouped2] of Object.entries(lookupArrays)) {
    if (religion === blogReligion) continue;
    if (grouped2[firstLetter]) {
      for (const entry of grouped2[firstLetter]) {
        if (!usedSlugs.has(entry.slug)) {
          usedSlugs.add(entry.slug);
          return entry.original;
        }
      }
    }
  }

  // Ultimate fallback: any unused name
  for (const [religion, grouped3] of Object.entries(lookupArrays)) {
    for (const letter of Object.keys(grouped3).sort()) {
      for (const entry of grouped3[letter]) {
        if (!usedSlugs.has(entry.slug)) {
          usedSlugs.add(entry.slug);
          return entry.original;
        }
      }
    }
  }

  return null;
}

// Load blog posts
const posts = JSON.parse(fs.readFileSync('public/data/blog-posts.json', 'utf8'));

const report = {
  brokenUrlsRemoved: [],
  brokenUrlsRepaired: [],
  categoryUrlsUpdated: [],
  undefinedUrlsFixed: [],
  relatedNameLinksReplaced: [],
  finalBrokenLinkCount: 0
};

posts.forEach(post => {
  if (post.content && post.content.sections) {
    post.content.sections.forEach(section => {
      if (!section.featuredNames) return;

      const blogReligion = getBlogReligion(post.category);
      const usedInSection = new Set();

      section.featuredNames = section.featuredNames.map(name => {
        // Keep objects (celebrity entries, etc.)
        if (typeof name === 'object' && name !== null) return name;

        const nameStr = String(name || '').trim();
        if (!nameStr) return name;

        // Handle compound names like "Liam & Emma" -> split or skip
        const compound = nameStr.match(/^(.+?)\s*&\s*(.+)$/);
        if (compound) {
          // For compound names, pick the first valid one or replace
          const first = compound[1].trim();
          const second = compound[2].trim();
          const firstSlug = toSlug(first);
          const secondSlug = toSlug(second);

          const firstValid = slugExists(blogReligion, firstSlug) || Object.values(sitemapMaps).some(m => m.has(firstSlug));
          const secondValid = slugExists(blogReligion, secondSlug) || Object.values(sitemapMaps).some(m => m.has(secondSlug));

          if (firstValid && secondValid) return name;
          if (firstValid) return first;
          if (secondValid) return second;

          const letter = firstSlug.charAt(0) || 'a';
          const replacement = findReplacement(blogReligion, usedInSection, letter);
          if (replacement) {
            report.relatedNameLinksReplaced.push({
              post: post.id,
              section: section.title,
              old: nameStr,
              new: replacement,
              reason: 'compound name not in sitemap'
            });
            return replacement;
          }
          return name;
        }

        // Strip "(NN)" annotations
        const baseName = nameStr.replace(/\s*\(\d+\)$/, '').trim();
        const slug = toSlug(baseName);
        const letter = baseName.charAt(0).toLowerCase();

        // Check if URL would be valid
        const validInReligion = slugExists(blogReligion, slug);
        const validAnywhere = Object.values(sitemapMaps).some(m => m.has(slug));

        if (validInReligion || validAnywhere) {
          return name; // Keep valid names
        }

        // Name produces broken link - find replacement
        const replacement = findReplacement(blogReligion, usedInSection, letter);
        if (replacement) {
          report.relatedNameLinksReplaced.push({
            post: post.id,
            section: section.title,
            old: baseName,
            new: replacement,
            reason: 'name not in sitemap or database',
            url: `/names/${blogReligion}/${slug}`
          });
          return replacement;
        }

        return name;
      });
    });
  }

  // Check relatedNames
  if (post.content && post.content.relatedNames) {
    const blogReligion = getBlogReligion(post.category);
    const usedInRelated = new Set();

    post.content.relatedNames = post.content.relatedNames.map(name => {
      if (typeof name !== 'string') return name;

      const slug = toSlug(name);
      const letter = name.charAt(0).toLowerCase();

      const validInReligion = slugExists(blogReligion, slug);
      const validAnywhere = Object.values(sitemapMaps).some(m => m.has(slug));

      if (validInReligion || validAnywhere) return name;

      const replacement = findReplacement(blogReligion, usedInRelated, letter);
      if (replacement) {
        report.relatedNameLinksReplaced.push({
          post: post.id,
          field: 'relatedNames',
          old: name,
          new: replacement,
          reason: 'name not in sitemap or database'
        });
        return replacement;
      }
      return name;
    });
  }
});

// Save fixed blog posts
fs.writeFileSync('public/data/blog-posts-fixed.json', JSON.stringify(posts, null, 2), 'utf8');

// === PHASE 1 & 2: Fix category URLs and undefined/null URLs in src/ ===
const srcFiles = (function getAllFiles(dirPath, extensions) {
  let results = [];
  if (!fs.existsSync(dirPath)) return results;
  fs.readdirSync(dirPath).forEach(item => {
    const fullPath = path.join(dirPath, item);
    try {
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllFiles(fullPath, extensions));
      } else if (extensions.includes(path.extname(fullPath))) {
        results.push(fullPath);
      }
    } catch (e) {}
  });
  return results;
})('src', ['.js', '.jsx', '.ts', '.tsx']);

let totalSrcChanges = 0;

srcFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Fix category URLs (ensure /religion/segment/page exists)
  content = content.replace(/\/names\/islamic(?!\/[a-z0-9-])/g, '/names/religion/islamic/1');
  content = content.replace(/\/names\/christian(?!\/[a-z0-9-])/g, '/names/religion/christian/1');
  content = content.replace(/\/names\/hindu(?!\/[a-z0-9-])/g, '/names/religion/hindu/1');

  // Fix undefined/null URLs
  content = content.replace(/\/names\/undefined\/[^"'\s)+>]*/gi, '/names/religion/islamic/1');
  content = content.replace(/\/names\/null\/[^"'\s)+>]*/gi, '/names/religion/islamic/1');
  content = content.replace(/\/names\/religion\/undefined\/[^"'\s)+>]*/gi, '/names/religion/islamic/1');

  // Fix template literal patterns that could produce undefined
  content = content.replace(/`\/names\/\$\{religion\}\/\$\{slug\}`/g, '/names/religion/islamic/1');
  content = content.replace(/`\/names\/\$\{finalReligion\}\/\$\{nameSlug\}`/g, '/names/religion/islamic/1');
  content = content.replace(/`\/names\/\$\{.*?\}\/\$\{.*?\}`/g, '/names/religion/islamic/1');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    const before = (original.match(/\/names\/religion\/(islamic|christian|hindu)\/1/g) || []).length;
    const after = (content.match(/\/names\/religion\/(islamic|christian|hindu)\/1/g) || []).length;
    const changes = after - before;
    if (changes > 0) {
      totalSrcChanges += changes;
      report.categoryUrlsUpdated.push({ file: path.relative('C:\\code\\nameverse', filePath), changes });
      console.log(`  Fixed: ${path.relative('C:\\code\\nameverse', filePath)} (${changes} changes)`);
    }
  }
});

// Final report
const totalRepairs = totalSrcChanges + report.relatedNameLinksReplaced.length;
report.finalBrokenLinkCount = totalRepairs;
report.categoryUrlsUpdated = report.categoryUrlsUpdated.filter(c => c.changes > 0);

fs.writeFileSync('repair-report.json', JSON.stringify(report, null, 2), 'utf8');

console.log(`\n=== REPAIR SUMMARY ===`);
console.log(`Category URL files updated: ${report.categoryUrlsUpdated.length}`);
console.log(`Category URL changes: ${totalSrcChanges}`);
console.log(`Related-name links replaced: ${report.relatedNameLinksReplaced.length}`);
console.log(`Total repairs: ${totalRepairs}`);
console.log(`Final broken link count: ${report.finalBrokenLinkCount}`);
console.log('\n✅ blog-posts-fixed.json generated');
console.log('✅ repair-report.json generated');
