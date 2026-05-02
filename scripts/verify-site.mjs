import { readFileSync, existsSync, statSync } from 'node:fs';

const requiredFiles = ['index.html', 'en/index.html', 'ko/index.html', 'styles.css', 'CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml', '404.html', '.github/workflows/deploy.yml', '.gitignore', 'files/ghkim-anim.svg', 'files/logos/jcloud.png', 'files/logos/ampm.png', 'files/logos/jcode.png', 'files/logos/jllm.png', 'files/logos/lsa.png', 'files/logos/skax.svg', 'files/logos/rooty.svg', 'files/logos/jbnu.png', 'files/icons/briefcase.svg', 'files/icons/trophy.svg', 'files/icons/chip.svg', 'files/icons/cloud.svg', 'files/icons/database.svg', 'files/icons/api.svg', 'files/logos/linkedin.svg', 'files/logos/github.svg', 'files/logos/gmail.svg', 'files/skills/kotlin.svg', 'files/skills/java.svg', 'files/skills/python.svg', 'files/skills/springboot.svg', 'files/skills/spring-ai.svg', 'files/skills/fastapi.svg', 'files/skills/langchain4j.svg', 'files/skills/vllm.svg', 'files/skills/redis.svg', 'files/skills/caffeine.svg', 'files/skills/mysql.svg', 'files/skills/docker.svg', 'files/skills/kubernetes.svg', 'files/skills/openstack.svg', 'files/skills/aws.svg', 'files/skills/prometheus.svg'];
const requiredInHtml = [
  '김규호',
  'ghkim.dev',
  '백엔드 엔지니어 · Agentic AI · Cloud Systems',
  '비효율을 기술로 해결하는 백엔드 엔지니어',
  'Multi-Agent 오케스트레이션',
  '저지연 백엔드 아키텍처',
  'Private LLM 서빙',
  'Career &amp; Education',
  'Awards &amp; Honors',
  'Skills',
  'Apps &amp; Projects',
  'Teams',
  'Contacts',
  'class="language-switch"',
  'class="role-list"',
  '© 2026 GyuHo Kim. All rights reserved.',
  'SK AX',
  'Software Engineer · 2025.09',
  'Div. Enterprise Service · Work Style Innovation Squad(2026.05—)',
  'AI Innovator',
  'AX Service 2(2026.01~)',
  'AI-driven automated software delivery pipeline',
  'human-in-the-loop validation',
  'Enterprise X(2025.11-12)',
  'Financial AI Agent Service PoC',
  'B.S. Software Engineering',
  'GPA 4.29 / 4.5',
  'Ranked 2nd in department',
  'OSLAB undergraduate researcher',
  'JCode',
  'https://jcode.jbnu.ac.kr/about',
  'JLLM',
  'JCloud',
  'LSA',
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
  'files/logos/rooty.svg',
  'files/logos/jbnu.png',
  'files/logos/linkedin.svg',
  'files/logos/github.svg',
  'files/logos/gmail.svg',
  'mailto:kyuhokim12@gmail.com',
  'https://www.linkedin.com/in/gyuho-kim-696568268/',
  'https://github.com/GyuHo123/rooty',
  'https://github.com/ijun17/LSA-web',
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

for (const file of ['files/logos/jdevops.png', 'files/logos/jbnu-private-llm.png', 'files/logos/jbnu.svg', 'files/logos/regsafe.svg', 'files/logos/lsa.svg', 'files/skills/nodejs.svg', 'files/skills/nginx.svg', 'files/skills/keycloak.svg', 'files/skills/oauth2.svg', 'files/skills/github-actions.svg', 'files/skills/rest-api.svg']) {
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
  for (const id of ['career', 'awards', 'skills', 'apps', 'teams']) {
    if (!sectionIds.includes(id)) {
      failures.push(`Missing section id: ${id}`);
    }
  }
  if (!html.includes('<footer id="footer" class="site-footer"') || !html.includes('class="footer-links"')) {
    failures.push('Contacts must be rendered as compact footer links, not a full section.');
  }
  if (html.includes('<section id="footer"')) {
    failures.push('Contacts should not remain as a section.');
  }
  const footerLinks = (html.match(/class="footer-links"[\s\S]*?<\/nav>/)?.[0].match(/<a\b/g) || []).length;
  if (footerLinks !== 3) {
    failures.push(`Footer should contain exactly 3 contact links, got: ${footerLinks}`);
  }
  if (html.includes('AX Service Team 2')) {
    failures.push('Career copy must use AX Service 2, not AX Service Team 2.');
  }
  if (!html.includes('id="home"')) {
    failures.push('Missing home cover id: home');
  }
  if (html.includes('Georgia') || html.includes('Times New Roman') || html.includes('Inter,')) {
    failures.push('HTML must not introduce non-Pretendard display/body fonts.');
  }
  for (const text of ['010-3922-3897', 'kimghdev@gmail.com', 'CV', 'docs.google.com/document', 'Capabilities', 'Code Club', 'Crenu', 'J-Devops', 'RegSafe', 'https://jcode.jbnu.ac.kr/"', 'Financial Recommendation MAS', 'DevOps RCA Agent', 'Lab Safety Assistant', 'Agentic AI 서비스 프로토타이핑', 'Agentic AI service prototyping', 'AI Innovator of Div. Enterprise Service', 'AX Service 2</b><span>AI-driven automated software delivery pipeline · human-in-the-loop validation · 2025.12—2026.08', 'Enterprise X</b><span>Financial AI Agent Service PoC · 2025.11—2025.12', '소프트웨어공학 학사', 'files/logos/regsafe.svg', 'files/logos/jdevops.png', 'files/logos/jbnu-private-llm.png', 'files/logos/jbnu.svg', 'files/skills/nodejs.svg', 'files/skills/nginx.svg', 'files/skills/keycloak.svg', 'files/skills/oauth2.svg', 'files/skills/github-actions.svg', 'files/skills/rest-api.svg']) {
    if (html.includes(text)) {
      failures.push(`index.html should omit lower-priority or removed item: ${text}`);
    }
  }

}

for (const [file, markers] of [
  ['en/index.html', ['<html lang="en">', 'Career &amp; Education', 'Apps &amp; Projects', 'href="/"', 'class="language-switch"', 'class="role-list"', '© 2026 GyuHo Kim. All rights reserved.', '../files/skills/kotlin.svg']],
  ['ko/index.html', ['<html lang="ko">', 'Career &amp; Education', 'Apps &amp; Projects', 'href="/en/"', 'class="language-switch"', 'class="role-list"', '© 2026 GyuHo Kim. All rights reserved.', '../files/skills/kotlin.svg']]
]) {
  if (existsSync(file)) {
    const html = readFileSync(file, 'utf8');
    for (const marker of markers) {
      if (!html.includes(marker)) failures.push(`${file} is missing language/page marker: ${marker}`);
    }
    if (html.includes('files/logos/regsafe.svg') || html.includes('files/logos/lsa.svg') || html.includes('Financial Recommendation MAS') || html.includes('DevOps RCA Agent') || html.includes('Lab Safety Assistant') || html.includes('Agentic AI 서비스 프로토타이핑') || html.includes('Agentic AI service prototyping') || html.includes('AI Innovator of Div. Enterprise Service') || html.includes('AX Service 2</b><span>AI-driven automated software delivery pipeline · human-in-the-loop validation · 2025.12—2026.08') || html.includes('Enterprise X</b><span>Financial AI Agent Service PoC · 2025.11—2025.12') || html.includes('소프트웨어공학 학사') || html.includes('files/skills/nodejs.svg') || html.includes('files/skills/github-actions.svg')) {
      failures.push(`${file} includes removed project/skill assets.`);
    }
    if (!html.includes('<footer id="footer" class="site-footer"') || !html.includes('class="footer-links"')) {
      failures.push(`${file} must render Contacts in the footer.`);
    }
    if (html.includes('<section id="footer"')) {
      failures.push(`${file} should not keep Contacts as a section.`);
    }
    const footerLinks = (html.match(/class="footer-links"[\s\S]*?<\/nav>/)?.[0].match(/<a\b/g) || []).length;
    if (footerLinks !== 3) {
      failures.push(`${file} footer should contain exactly 3 contact links, got: ${footerLinks}`);
    }
    if (html.includes('AX Service Team 2')) {
      failures.push(`${file} must use AX Service 2 naming.`);
    }
    const apps = html.match(/<section id="apps"[\s\S]*?<section id="teams"/)?.[0] || '';
    const projectLinks = (apps.match(/class="project-link"/g) || []).length;
    if (projectLinks < 5) failures.push(`${file} should render Apps & Projects as icon project links.`);
    if (apps.includes('<p>') || apps.includes('<article')) failures.push(`${file} Apps & Projects should not use paragraph/article descriptions.`);
  }
}

if (existsSync('styles.css')) {
  const css = readFileSync('styles.css', 'utf8');
  for (const text of ['@media', ':focus-visible', '--accent', '--aura', '--grid-line', 'cursor: auto', '100vh', '.project-link', '.ai-mark-animation', '.entry-logo', '.skills-grid', '.icon-columns', '.section-title-icon', '.site-footer', '.footer-links', '.language-switch', '.role-list', '@keyframes skill-float', '@keyframes skill-reveal', 'word-break: keep-all', '.lead,']) {
    if (!css.includes(text)) {
      failures.push(`styles.css is missing responsive/accessibility token: ${text}`);
    }
  }
  const prohibited = ['glassmorphism', 'backdrop-filter', 'border-radius: 999px', 'cursor: none'];
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
