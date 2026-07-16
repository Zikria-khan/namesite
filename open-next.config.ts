import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// KV incremental cache disabled (Option B).
// The default in-memory cache is used instead, so no KV namespace binding is
// required. Routes with `revalidate: 31536000` will serve static content with
// no edge revalidation — acceptable because ISR at the edge isn't needed yet.
const config = defineCloudflareConfig({});

// Only run the Next.js build here. The sitemap step is handled by the
// `cf:build` npm script that invokes opennextjs-cloudflare. Without this,
// OpenNext defaults to `npm run build`; if `build` also called
// `opennextjs-cloudflare build` it would recurse into an infinite build loop.
config.buildCommand = "next build";

export default config;