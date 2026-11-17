# Month Six

A website for men on minoxidil or minoxidil + finasteride who cannot tell whether their treatment is working.

Built for the Mosaic Wellness Fellowship challenge (Man Matters). Not an official Man Matters product.

## What it does
- Shed count: a home version of the refined wash test (Li et al., 2022), charted against healthy (~28), pattern hair loss (~52) and heavy shedding (55+) bands.
- Week-by-week reading from your count, your treatment week and four check-in answers.
- Same-angle photos with a compare slider, stored in the browser only (IndexedDB).
- Printable doctor report.
- No account: a random tracker code is the only key. No name, email or phone number.

## Stack
Next.js 16, TypeScript, Upstash Redis over REST (in-memory fallback locally). Set KV_REST_API_URL and KV_REST_API_TOKEN.

    npm install
    npm run dev
