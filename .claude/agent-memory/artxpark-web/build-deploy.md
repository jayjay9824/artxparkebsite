---
name: build-deploy
description: Verified commands and the hard rule that deploys never happen without 지니's explicit confirmation.
metadata:
  type: project
---

`package.json` scripts (only these exist):
- `npm run dev` — local dev server
- `npm run build` — production build (= quality gate; no lint/typecheck scripts exist, so build is the verification)
- `npm run start` — serve the production build

The repo's `package-lock.json` indicates npm is the canonical package manager (no `pnpm-lock.yaml` / `yarn.lock` seen). Use `npm` unless 지니 says otherwise.

Hard rule: never deploy / push to remote / trigger Vercel production without 지니's explicit confirmation in the conversation. Local build is fine.
