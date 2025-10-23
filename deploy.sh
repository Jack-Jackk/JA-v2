#!/bin/bash
# Quick Deploy Script for GitHub Pages

echo "🎮 JAC-MAN Portfolio Deployment"
echo "================================"
echo ""

# Check if on correct branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
    echo "⚠️  Warning: You're on branch '$BRANCH', not 'main'"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build the site
echo "📦 Building site..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Preview (optional)
read -p "Preview the build? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔍 Starting preview server..."
    echo "   Visit http://localhost:4173"
    echo "   Press Ctrl+C to stop preview and continue deployment"
    npm run preview
fi

# Git status
echo ""
echo "📊 Git status:"
git status --short

# Commit and push
echo ""
read -p "Commit and push to GitHub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter commit message: " COMMIT_MSG
    
    git add .
    git commit -m "$COMMIT_MSG"
    git push origin main
    
    echo ""
    echo "✅ Pushed to GitHub!"
    echo "🚀 GitHub Actions will deploy automatically"
    echo "⏱️  Deployment takes ~2-3 minutes"
    echo ""
    echo "🔗 Your site will be at:"
    echo "   https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/' | cut -d'/' -f1).github.io"
else
    echo "❌ Deployment cancelled"
    exit 0
fi

echo ""
echo "✨ Done!"
