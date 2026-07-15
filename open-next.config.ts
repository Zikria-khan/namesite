import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// KV incremental cache disabled (Option B).
// The default in-memory cache is used instead, so no KV namespace binding is
// required. Routes with `revalidate: 31536000` will serve static content with
// no edge revalidation — acceptable because ISR at the edge isn't needed yet.
export default defineCloudflareConfig({});