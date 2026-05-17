/**
 * IndexNow Bulk Submission Script
 * 
 * Reads all name JSON files and submits all name detail URLs to IndexNow
 * for immediate crawling by Bing, Google, Yandex, etc.
 * 
 * Usage: node scripts/submit-all-names.js
 * 
 * Submits in batches of 1000 URLs (IndexNow limit)
 * Waits 5 seconds between batches to avoid rate limiting
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://nameverse.vercel.app';
const INDEXNOW_KEY = 'd8127789-72bd-4672-b48e-9c0b5aa7f220a';
const BATCH_SIZE = 1000;
const BATCH_DELAY_MS = 5000;

// Name JSON files and their corresponding religion slugs
const NAME_SOURCES = [
  { file: 'public/islamic_names.json', religion: 'islamic' },
  { file: 'public/christians_names.json', religion: 'christian' },
  { file: 'public/hindu_names.json', religion: 'hindu' },
];

// Generate slug from name
function generateSlug(name) {
  if (!name || typeof name !== 'string') return '';
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Read all names from JSON files and generate URLs
function collectAllUrls() {
  const urls = new Set();

  // Add main site pages
  urls.add(`${SITE_URL}/`);
  urls.add(`${SITE_URL}/names`);
  urls.add(`${SITE_URL}/blog`);
  urls.add(`${SITE_URL}/about`);

  // Add name detail pages from all JSON files
  for (const source of NAME_SOURCES) {
    const filePath = path.join(process.cwd(), source.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${source.file} not found, skipping`);
      continue;
    }

    const names = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Processing ${names.length} ${source.religion} names from ${source.file}`);

    for (const name of names) {
      if (typeof name === 'string' && name.trim()) {
        const slug = generateSlug(name);
        if (slug) {
          urls.add(`${SITE_URL}/names/${source.religion}/${slug}`);
        }
      }
    }
  }

  return Array.from(urls);
}

// Submit a batch of URLs to IndexNow with retry logic
async function submitBatch(batch, maxRetries = 3) {
  // Try multiple endpoints
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    for (const endpoint of endpoints) {
      try {
        const res = await axios.post(
          endpoint,
          {
            host: 'nameverse.vercel.app',
            key: INDEXNOW_KEY,
            urlList: batch,
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
          }
        );
        console.log(`  ✓ Submitted ${batch.length} URLs — Status: ${res.status} (${endpoint})`);
        return { success: true, status: res.status };
      } catch (err) {
        const errorData = err.response?.data || err.message;
        const isVerificationError = errorData?.errorCode === 'SiteVerificationNotCompleted';
        
        // If verification not completed, wait longer and retry
        if (isVerificationError && attempt < maxRetries) {
          console.log(`  ⚠ Verification pending, waiting ${attempt * 30}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 30000));
          continue;
        }
        
        if (attempt === maxRetries) {
          console.error(`  ✗ Batch failed (${batch.length} URLs) after ${attempt} attempts:`, JSON.stringify(errorData).slice(0, 200));
          return { success: false, error: errorData };
        }
      }
    }
  }
  
  return { success: false, error: 'Max retries exceeded' };
}

// Main submission loop
async function main() {
  console.log('=== IndexNow Bulk URL Submission ===');
  console.log(`Site: ${SITE_URL}`);
  console.log(`Key: ${INDEXNOW_KEY}`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log(`Delay between batches: ${BATCH_DELAY_MS}ms\n`);

  // Collect all URLs
  console.log('Collecting URLs...');
  const allUrls = collectAllUrls();
  console.log(`Total unique URLs: ${allUrls.length}\n`);

  // Submit in batches
  console.log('Starting submission...');
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allUrls.length / BATCH_SIZE);

    console.log(`\nBatch ${batchNum}/${totalBatches} (${batch.length} URLs):`);
    const result = await submitBatch(batch);

    if (result.success) {
      successCount += batch.length;
    } else {
      failCount += batch.length;
    }

    // Wait between batches (except after the last one)
    if (i + BATCH_SIZE < allUrls.length) {
      console.log(`  Waiting ${BATCH_DELAY_MS / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  // Summary
  console.log('\n=== Submission Complete ===');
  console.log(`Total submitted: ${allUrls.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  if (failCount === 0) {
    console.log('\n✓ All URLs submitted successfully to IndexNow!');
    console.log('Search engines will now crawl your site faster.');
  } else {
    console.log(`\n⚠ ${failCount} URLs failed. Check errors above and retry.`);
  }
}

main().catch(console.error);