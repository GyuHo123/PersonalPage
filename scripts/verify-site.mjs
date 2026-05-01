import { readFileSync, existsSync, statSync } from 'node:fs';

const requiredFiles = ['index.html', 'styles.css', 'CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml', '404.html', '.github/workflows/deploy.yml', '.gitignore', 'files/ghkim-anim.svg'];
const requiredInHtml = [
  'GyuHo Kim',
  'ghkim.dev',
  'Software engineer building backend platforms, cloud tooling, and AI-assisted workflows.',
  'Career & Education',
  'Awards & Honors',
  'Skills',
  'Apps & Projects',
  'Teams',
  'Contacts',
  'SK AX',
  'JCode',
  'Lab Safety Assistant',
  'RegSafe',
  'Jeonbuk National University',
  'Pretendard Variable',
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css',
  'class="subjects"',
  'class="sidebar navigator"',
  'class="sidebar socials"',
  'id="cursor"',
  'main-cover',
  'files/ghkim-anim.svg',
  'signature-animation',
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
  for (const id of ['career', 'awards', 'skills', 'apps', 'teams', 'footer']) {
    if (!sectionIds.includes(id)) {
      failures.push(`Missing section id: ${id}`);
    }
  }
  if (!html.includes('id="home"')) {
    failures.push('Missing joonas-style home cover id: home');
  }
  if (html.includes('Georgia') || html.includes('Times New Roman') || html.includes('Inter')) {
    failures.push('HTML must not introduce non-Pretendard display/body fonts.');
  }
}

if (existsSync('styles.css')) {
  const css = readFileSync('styles.css', 'utf8');
  for (const text of ['@media', ':focus-visible', '--accent', '--section-bg', 'cursor: none', '100vh']) {
    if (!css.includes(text)) {
      failures.push(`styles.css is missing responsive/accessibility token: ${text}`);
    }
  }
  const prohibited = ['glassmorphism', 'backdrop-filter', 'border-radius: 999px'];
  for (const text of prohibited) {
    if (css.includes(text)) {
      failures.push(`styles.css should avoid AI-looking visual trope: ${text}`);
    }
  }
  if (!css.includes('font-family: "Pretendard Variable"') && !css.includes("font-family: 'Pretendard Variable'")) {
    failures.push('styles.css must use Pretendard Variable as the fixed font family.');
  }
  for (const text of ['Georgia', 'Times New Roman', 'Inter,']) {
    if (css.includes(text)) {
      failures.push(`styles.css must not use non-Pretendard font: ${text}`);
    }
  }
}



if (existsSync('files/ghkim-anim.svg')) {
  const svg = readFileSync('files/ghkim-anim.svg', 'utf8');
  for (const text of ['<svg', '<title>Animated ghkim.dev line signature</title>', '@keyframes draw-signature', 'stroke-dasharray', 'stroke-dashoffset', 'prefers-reduced-motion', 'pathLength="1"']) {
    if (!svg.includes(text)) {
      failures.push(`files/ghkim-anim.svg is missing animation/accessibility marker: ${text}`);
    }
  }
  const pathCount = (svg.match(/<path\b/g) || []).length;
  if (pathCount < 5) {
    failures.push('files/ghkim-anim.svg should contain at least five original line paths.');
  }
  if (svg.includes('1127 327') || svg.includes('23.977 211.972') || svg.includes('331.92 35.25')) {
    failures.push('files/ghkim-anim.svg must not copy the joonas.io path data.');
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
  if (workflow.includes('cache: npm') && !existsSync('package-lock.json')) {
    failures.push('GitHub Actions workflow must not enable npm cache without package-lock.json.');
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
