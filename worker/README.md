# Project-request backend

This Worker receives the project form and creates a GitHub Issue.

## Deploy

1. Create a Cloudflare Worker.
2. Paste `worker/index.js` into it.
3. Add a Worker secret named `GITHUB_TOKEN`.
4. The token needs permission to create issues in `nikobutcooler/nikobutcooler.github.io`.
5. Deploy the Worker.
6. Set the Worker URL in the site's form JavaScript as `PROJECT_API`.

Do **not** put the GitHub token in the GitHub Pages frontend.
