# Changelog

All notable changes to Blog CMS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- RSS feed support
- Comment system integration (Giscus)
- Multi-language (i18n) support

## [1.3.0] - 2026-09-06

### Added
- Sitemap auto-generation on build
- Open Graph image support for blog posts
- Code syntax highlighting via Shiki (replaces Highlight.js)
- Reading time estimate displayed on post cards

### Changed
- Upgraded Hugo to v0.136.0
- Migrated admin authentication to Cloudflare Zero Trust Access
- Improved mobile navigation UX with slide-in drawer

### Fixed
- Search index not including posts with future dates
- Dark mode flicker when navigating between pages via View Transitions API

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
