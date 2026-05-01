import { readFileSync, existsSync, statSync } from 'node:fs';

const requiredFiles = ['index.html', 'styles.css', 'CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml', '404.html', '.github/workflows/deploy.yml', '.gitignore'];
const requiredInHtml = [
  'GyuHo Kim',
  'ghkim.dev',
  'Software Engineer',
  'SK AX',
  'JCode',
  'Lab Safety Assistant',
  'RegSafe',
  'Jeonbuk National University',
  'https://www.linkedin.com/in/gyuho-kim-696568268/',
  'https://github.com/GyuHo123'
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    failures.push(`Missing required file: ${file}`);
  }
}

if (existsSync('index.html')) {
  const html = readFileSync('index.html', 'utf8');
  for (const text of requiredInHtml) {
    if (!html.includes(text)) {
      failures.push(`index.html is missing required content: ${text}`);
    }
  }

  const requiredMeta = [
    'name="viewport"',
    'name="description"',
    'property="og:title"',
    'property="og:url"',
    'rel="canonical"',
    'application/ld+json'
  ];
  for (const text of requiredMeta) {
    if (!html.includes(text)) {
      failures.push(`index.html is missing SEO/accessibility metadata: ${text}`);
    }
  }

  const anchorLabels = Array.from(html.matchAll(/<a\b[^>]*>(.*?)<\/a>/gis)).map(([, label]) => label.replace(/<[^>]+>/g, '').trim());
  if (anchorLabels.some((label) => !label || /^(click here|here|link)$/i.test(label))) {
    failures.push('Links must have descriptive labels.');
  }

  const sectionIds = Array.from(html.matchAll(/<section\b[^>]*id="([^"]+)"/g)).map(([, id]) => id);
  for (const id of ['work', 'projects', 'recognition', 'contact']) {
    if (!sectionIds.includes(id)) {
      failures.push(`Missing section id: ${id}`);
    }
  }
}

if (existsSync('styles.css')) {
  const css = readFileSync('styles.css', 'utf8');
  for (const text of ['prefers-color-scheme', '@media', ':focus-visible', '--accent']) {
    if (!css.includes(text)) {
      failures.push(`styles.css is missing responsive/accessibility token: ${text}`);
    }
  }
}

if (existsSync('CNAME')) {
  const cname = readFileSync('CNAME', 'utf8').trim();
  if (cname !== 'ghkim.dev') {
    failures.push(`CNAME must be ghkim.dev, got: ${cname || '<empty>'}`);
  }
}

if (existsSync('sitemap.xml')) {
  const sitemap = readFileSync('sitemap.xml', 'utf8');
  if (!sitemap.includes('https://ghkim.dev/')) {
    failures.push('sitemap.xml must reference https://ghkim.dev/.');
  }
}

if (existsSync('.github/workflows/deploy.yml')) {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  for (const text of ['actions/deploy-pages', 'actions/upload-pages-artifact', 'pages: write', 'id-token: write', 'npm test', 'npm run build']) {
    if (!workflow.includes(text)) {
      failures.push(`GitHub Pages workflow is missing: ${text}`);
    }
  }
}

if (existsSync('.gitignore')) {
  const gitignore = readFileSync('.gitignore', 'utf8');
  if (!gitignore.includes('.omx/')) {
    failures.push('.gitignore must exclude local .omx runtime state.');
  }
}

if (existsSync('index.html') && statSync('index.html').size > 180_000) {
  failures.push('index.html should remain lightweight for GitHub Pages.');
}

if (failures.length) {
  console.error('Site verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Site verification passed.');
