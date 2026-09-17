# Hardik Dhingra — Racing Portfolio

F1-inspired portfolio built with React, JavaScript, and Vite. Includes an optional five-light ignition sequence, responsive project garage, résumé download, and motion controls that respect reduced-motion preferences.

## Development

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the `dist` directory. GitHub Pages deployment is configured in `.github/workflows/pages.yml`; the repository's Pages source must be set to **GitHub Actions** before deployment. The custom domain is retained in `public/CNAME`.

Content lives in `src/main.jsx`, styles in `src/styles.css`, and served static assets in `public`. Update `public/Had_Resume.pdf` when replacing the résumé. The race car is an original generated illustration, not an official team asset.
