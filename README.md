# ghkim.dev

Static personal page for GyuHo Kim, designed for GitHub Pages with the custom domain `ghkim.dev`.

## Local verification

```bash
npm test
```

The verification script checks required static-hosting files, metadata, core profile content, accessibility basics, and the custom-domain `CNAME`.

## GitHub Pages deployment

1. Push these files to the GitHub repository that will host the page.
2. In **Settings → Pages**, choose **Deploy from a branch** and select the branch/root directory, or use GitHub’s static Pages defaults.
3. Keep `CNAME` in the repository root so GitHub Pages serves the site as `ghkim.dev`.
4. Configure DNS for `ghkim.dev` according to GitHub Pages custom-domain records.


## GitHub Actions deployment

The repository includes `.github/workflows/deploy.yml`, which verifies the static site with `npm test`, runs `npm run build`, uploads the repository root as a Pages artifact, and deploys it with GitHub's official Pages actions.

The workflow runs on pushes to `main` and can also be started manually with `workflow_dispatch`.
