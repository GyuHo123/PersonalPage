import { readFileSync, existsSync, statSync } from 'node:fs';

const requiredFiles = ['index.html', 'en/index.html', 'ko/index.html', 'styles.css', 'CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml', '404.html', '.github/workflows/deploy.yml', '.gitignore', 'files/ghkim-anim.svg', 'files/logos/jcloud.png', 'files/logos/ampm.png', 'files/logos/jcode.png', 'files/logos/jllm.png', 'files/logos/lsa.svg', 'files/logos/skax.svg', 'files/logos/jbnu.png', 'files/icons/briefcase.svg', 'files/icons/trophy.svg', 'files/icons/chip.svg', 'files/icons/cloud.svg', 'files/icons/database.svg', 'files/icons/api.svg', 'files/logos/linkedin.svg', 'files/logos/github.svg', 'files/logos/gmail.svg', 'files/skills/kotlin.svg', 'files/skills/java.svg', 'files/skills/python.svg', 'files/skills/springboot.svg', 'files/skills/spring-ai.svg', 'files/skills/fastapi.svg', 'files/skills/langchain4j.svg', 'files/skills/vllm.svg', 'files/skills/redis.svg', 'files/skills/caffeine.svg', 'files/skills/mysql.svg', 'files/skills/docker.svg', 'files/skills/kubernetes.svg', 'files/skills/openstack.svg', 'files/skills/aws.svg', 'files/skills/prometheus.svg'];
const requiredInHtml = [
  '김규호',
  'ghkim.dev',
  '백엔드 엔지니어 · Agentic AI · Cloud Systems',
  '비효율을 기술로 해결하는 백엔드 엔지니어',
  'Multi-Agent 오케스트레이션',
  '저지연 백엔드 아키텍처',
  'Private LLM 서빙',
  '경력 &amp; 학력',
  '수상 &amp; 활동',
  'Skills',
  'Apps &amp; Projects',
  'Teams',
  '연락처',
  'SK AX',
  'JCode',
  'JLLM',
  'JCloud',
  'Lab Safety Assistant',
  'Kotlin',
  'Java',
  'Python',
  'Spring Boot',
  'Spring AI',
  'FastAPI',
  'LangChain4j',
  'vLLM',
  'Redis',
  'Caffeine',
  'MySQL / MariaDB',
  'Docker',
  'Kubernetes',
  'OpenStack',
  'AWS',
  'Prometheus / Grafana',
  'files/skills/kotlin.svg',
  'files/skills/spring-ai.svg',
  'files/skills/fastapi.svg',
  'files/skills/langchain4j.svg',
  'files/skills/caffeine.svg',
  'files/skills/kubernetes.svg',
  'files/skills/aws.svg',
  'files/skills/prometheus.svg',
  'files/logos/skax.svg',
  'files/logos/jbnu.png',
  'files/logos/linkedin.svg',
  'files/logos/github.svg',
  'files/logos/gmail.svg',
  'mailto:kyuhokim12@gmail.com',
  'https://www.linkedin.com/in/gyuho-kim-696568268/',
  'https://github.com/GyuHo123',
  'Pretendard Variable',
  'id="cursor"',
  'main-cover',
  'files/ghkim-anim.svg',
  'ai-mark-animation',
  'href="/en/"',
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    failures.push(`Missing required file: ${file}`);
  }
}

for (const file of ['files/logos/jdevops.png', 'files/logos/jbnu-private-llm.png', 'files/logos/jbnu.svg', 'files/logos/regsafe.svg', 'files/skills/nodejs.svg', 'files/skills/nginx.svg', 'files/skills/keycloak.svg', 'files/skills/oauth2.svg', 'files/skills/github-actions.svg', 'files/skills/rest-api.svg']) {
  if (existsSync(file)) {
    failures.push(`Removed logo file should not remain: ${file}`);
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
    failures.push('Missing home cover id: home');
  }
  if (html.includes('Georgia') || html.includes('Times New Roman') || html.includes('Inter,')) {
    failures.push('HTML must not introduce non-Pretendard display/body fonts.');
  }
  for (const text of ['010-3922-3897', 'kimghdev@gmail.com', 'Capabilities', 'Code Club', 'Crenu', 'J-Devops', 'RegSafe', 'files/logos/regsafe.svg', 'files/logos/jdevops.png', 'files/logos/jbnu-private-llm.png', 'files/logos/jbnu.svg', 'files/skills/nodejs.svg', 'files/skills/nginx.svg', 'files/skills/keycloak.svg', 'files/skills/oauth2.svg', 'files/skills/github-actions.svg', 'files/skills/rest-api.svg']) {
    if (html.includes(text)) {
      failures.push(`index.html should omit lower-priority or removed item: ${text}`);
    }
  }

}

for (const [file, markers] of [
  ['en/index.html', ['<html lang="en">', 'Career &amp; Education', 'Apps &amp; Projects', 'href="/"', '../files/skills/kotlin.svg']],
  ['ko/index.html', ['<html lang="ko">', '경력 &amp; 학력', 'Apps &amp; Projects', 'href="/en/"', '../files/skills/kotlin.svg']]
]) {
  if (existsSync(file)) {
    const html = readFileSync(file, 'utf8');
    for (const marker of markers) {
      if (!html.includes(marker)) failures.push(`${file} is missing language/page marker: ${marker}`);
    }
    if (html.includes('files/logos/regsafe.svg') || html.includes('files/skills/nodejs.svg') || html.includes('files/skills/github-actions.svg')) {
      failures.push(`${file} includes removed project/skill assets.`);
    }
    const apps = html.match(/<section id="apps"[\s\S]*?<section id="teams"/)?.[0] || '';
    const projectLinks = (apps.match(/class="project-link"/g) || []).length;
    if (projectLinks < 6) failures.push(`${file} should render Apps & Projects as icon project links.`);
    if (apps.includes('<p>') || apps.includes('<article')) failures.push(`${file} Apps & Projects should not use paragraph/article descriptions.`);
  }
}

if (existsSync('styles.css')) {
  const css = readFileSync('styles.css', 'utf8');
  for (const text of ['@media', ':focus-visible', '--accent', '--aura', '--grid-line', 'cursor: none', '100vh', '.project-link', '.ai-mark-animation', '.entry-logo', '.skills-grid', '.icon-columns', '.section-title-icon', '.logo-contacts', '@keyframes skill-float', '@keyframes skill-reveal']) {
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
  for (const text of ['<svg', '<title>AI infrastructure lattice mark</title>', '@keyframes lattice-draw', '@keyframes node-scan', 'stroke-dasharray', 'stroke-dashoffset', 'prefers-reduced-motion', 'pathLength="1"']) {
    if (!svg.includes(text)) {
      failures.push(`files/ghkim-anim.svg is missing animation/accessibility marker: ${text}`);
    }
  }
  const pathCount = (svg.match(/<path\b/g) || []).length;
  const circleCount = (svg.match(/<circle\b/g) || []).length;
  if (pathCount < 6 || circleCount < 4) {
    failures.push('files/ghkim-anim.svg should contain an original AI lattice motif with multiple paths and nodes.');
  }
  for (const text of ['lattice-line', 'neural-node', 'inference-core']) {
    if (!svg.includes(text)) {
      failures.push(`files/ghkim-anim.svg is missing AI infrastructure motif marker: ${text}`);
    }
  }
  for (const text of ['1127 327', '23.977 211.972', '331.92 35.25', 'orbit-ring', 'smile', 'swoosh']) {
    if (svg.includes(text)) {
      failures.push(`files/ghkim-anim.svg must avoid copied or logo-like marker: ${text}`);
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
