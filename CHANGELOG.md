# Changelog

All notable changes to Blog CMS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- RSS feed support
- Comment system integration (Giscus)
- Multi-language (i18n) support
- Sitemap auto-generation on build

## [1.4.0] - 2026-09-07

### Added
- Comprehensive deployment guide (`docs/DEPLOYMENT.md`) for Cloudflare Pages, Vercel, and GitHub Pages
- Environment variable reference table
- Local development quick-start with Hugo version pinning

### Changed
- Upgraded Hugo extended to v0.136.0
- CF Pages authentication now defaults to Cloudflare Zero Trust Access (replaces Netlify Identity default)

### Fixed
- 404 on `/admin` when `_redirects` missing from `static/` — added file with documentation

## [1.3.0] - 2026-09-08

### Added
- GitHub Actions Lighthouse CI workflow
- Bug report & feature request issue templates
- `CONTRIBUTING.md` with clear PR guidelines

### Improved
- Build pipeline now outputs minified HTML/CSS/JS
- Dark mode: eliminated FOUC (Flash of Unstyled Content) on first load

## [1.2.0] - 2026-09-05

### Added
- Mobile-responsive admin panel
- Image optimization pipeline
- Draft post support

### Fixed
- Dark mode flash on initial page load
- Search index not updating after post deletion

## [1.1.0] - 2026-09-01

### Added
- Full-text search functionality
- Tag-based filtering
- Social sharing buttons

### Changed
- Improved build performance (40% faster)
- Migrated from PaperCSS to custom Tailwind theme

## [1.0.0] - 2026-08-28

### Added
- Initial release
- Hugo static site generator integration
- Decap CMS admin dashboard
- Cloudflare Pages / Vercel / GitHub Pages deployment support
- Dark/light/auto theme switching
- Markdown-based content management
