import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// Durable ISR / incremental cache via Cloudflare KV.
//
// The built-in KV incremental cache adapter binds to the KV namespace whose
// wrangler binding is "NEXT_INC_CACHE_KV" (kv-incremental-cache.js:
// `BINDING_NAME = "NEXT_INC_CACHE_KV"`). Create the namespace with:
//   wrangler kv namespace create NEXT_INC_CACHE_KV
// then paste the returned id into the [[kv_namespaces]] block in wrangler.toml.
//
// How `revalidate: 31536000` flows through KV (post-deploy verification):
//   1. Hit a name page once (e.g. /names/islamic/muhammad) to warm the cache.
//   2. Cloudflare dashboard → Storage & Databases → the KV namespace.
//      You should see cache keys prefixed with "incremental-cache" holding the
//      rendered page payload + a `lastModified` timestamp.
//   3. A second request returns the cached entry (fast TTFB) with NO new backend
//      fetch — confirm by watching the backend API's request logs.
//   4. Because the adapter does NOT set a KV TTL, the 1-year `revalidate` means
//      entries persist until explicitly purged/invalidated (manual KV delete or
//      a cache-tag purge). This removes the per-isolate cold-start regen problem.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
