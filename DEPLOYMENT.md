# Deployment Guide - GitHub Pages

## Prerequisites

1. Your code is in the JA-v2 directory
2. You have a GitHub repository (e.g., `yourusername/JA`)
3. You have Git installed and configured

## Deployment Options

### Option 1: Root Domain (yourusername.github.io) - RECOMMENDED

If you want this to be your main portfolio at `yourusername.github.io`:

1. **Rename your repository** (if needed) to `yourusername.github.io` (replace `yourusername` with your actual GitHub username)

2. **Build the site locally** (optional test):
   ```bash
   npm run build
   npm run preview
   ```

3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy Jac-Man portfolio to GitHub Pages"
   git push origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **GitHub Actions**
   - The site will automatically deploy!

### Option 2: Subdirectory (yourusername.github.io/JA)

If you want to keep it at a subdirectory like `yourusername.github.io/JA`:

1. **Update svelte.config.js** - Change the base path:
   ```javascript
   base: process.argv.includes('dev') ? '' : '/JA'
   ```

2. **Update GitHub Actions workflow** - Edit `.github/workflows/deploy.yml`:
   ```yaml
   - name: Build
     env:
       BASE_PATH: '/JA'
     run: npm run build
   ```

3. **Follow steps 2-4 from Option 1**

## Manual Deployment (Alternative)

If you prefer manual deployment without GitHub Actions:

1. **Build the site**:
   ```bash
   npm run build
   ```

2. **Install gh-pages** (one time):
   ```bash
   npm install -D gh-pages
   ```

3. **Add deploy script to package.json**:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d build -t true"
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / root

## Verification

1. Wait 1-2 minutes for deployment to complete
2. Visit your site:
   - Root: `https://yourusername.github.io`
   - Subdirectory: `https://yourusername.github.io/JA`

## Troubleshooting

### Assets not loading?
- Check the `base` path in `svelte.config.js` matches your deployment URL
- Ensure `.nojekyll` file exists in `static/` directory

### 404 errors?
- Verify `prerender = true` is set in `src/routes/+layout.js`
- Check GitHub Actions logs for build errors

### Game state not saving?
- localStorage works fine with GitHub Pages
- HTTPS is automatically enabled

## Updating Your Site

After making changes:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

GitHub Actions will automatically rebuild and redeploy!

## Custom Domain (Optional)

To use a custom domain like `jackbeyta.com`:

1. Add a `CNAME` file to `/static/` with your domain
2. Configure DNS with your domain provider:
   - A records pointing to GitHub Pages IPs
   - Or CNAME pointing to `yourusername.github.io`
3. Enable HTTPS in GitHub Pages settings

## Performance Tips

- Static site loads instantly (pre-rendered HTML)
- All assets are cached
- Game runs entirely client-side
- No server needed!

## Security Notes

- The legal disclaimer is included at `/disclaimer`
- All code is open source (your repository is public)
- No sensitive data should be in the code
- Game state is stored locally in user's browser

---

**Need help?** Check the GitHub Actions tab in your repository to see deployment status and logs.
