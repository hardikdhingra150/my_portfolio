// All site content lives here. Edit this file to update the portfolio.
export const me = {
  name: 'Hardik Dhingra',
  first: 'HARDIK',
  last: 'DHINGRA',
  role: 'Full-stack developer & builder',
  email: 'hardikdhingra150@gmail.com',
  github: 'https://github.com/hardikdhingra150',
  githubUser: 'hardikdhingra150',
  linkedin: 'https://www.linkedin.com/in/hardik-dhingra-ab2264280',
  resume: '/Had_Resume.pdf',
  city: 'Gurugram, India',
  tz: 'Asia/Kolkata',
  available: 'Open to internships & collaborations',
};

/* art: which ASCII scene renders on the cover. theme: cover palette. */
export const projects = [
  {
    slug: 'notchi', cover: 'NOTCHI', name: 'Notchi', year: 2026, kind: 'macOS · Open source', cat: 'macOS',
    tagline: 'The notch, with personality.',
    lines: ['THE NOTCH', 'GETS A', 'PERSONALITY'],
    summary: 'A free, open-source, fully animated macOS desktop suite. The notch, wallpaper, dock, icons, sidebar, menu bar, sounds and cursor all follow one theme.',
    features: ['An animated notch island with Home, Now Playing and File shelf pages', 'Whole-desktop theming: wallpaper, dock, icons, menu bar, sounds and cursor', 'Website with a live notch simulator and a theme builder', 'Free wallpapers made from real NASA and National Park Service footage', 'Installs through its own Homebrew tap'],
    stack: ['Swift', 'SwiftUI', 'AppKit', 'Homebrew'],
    live: 'https://notchi-plum.vercel.app', repo: 'Notchi', art: 'notch', theme: 'cream', featured: true,
  },
  {
    slug: 'skillforge', cover: 'SKILLFORGE', name: 'SkillForge', year: 2026, kind: 'AI agents · Infrastructure', cat: 'AI',
    tagline: 'Build what’s missing, repair what breaks, remember what works.',
    lines: ['SKILLS THAT', 'REPAIR', 'THEMSELVES'],
    summary: 'Self-evolving skill infrastructure for AI agents. Ask anything or drop in a spreadsheet: SkillForge reuses a skill, writes a new one, tests it in a sandbox, has a second model check the answer and saves it for everyone.',
    features: ['Sandboxed executor with CPU and time limits and approved tools', 'Cross-model verifier and cost-aware model routing, with SSE live streaming', 'An MCP server that exposes skills to Claude Code, Codex and Cursor', 'One Studio for questions and CSV/Excel tasks, with a model picker (Auto, Claude, Codex or local)', 'New skills are written, sandbox-tested and verified by a second model', 'Failing skills run automatic fixes first, then a model rewrite, saved as a new version', 'Every step is visible: reused, created or repaired', 'React workspace on a FastAPI + PostgreSQL backend'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'LLMs', 'MCP'],
    live: 'https://skillforge-beta-lilac.vercel.app', repo: 'SkillForge', art: 'gear', theme: 'ember', featured: true,
  },
  {
    slug: 'trackmind', cover: 'TRACKMIND', name: 'TrackMind AI', year: 2026, kind: 'Railways · ML', cat: 'AI',
    tagline: 'Real-time railway operations intelligence.',
    lines: ['SEE THE', 'CONFLICT', 'BEFORE IT HAPPENS'],
    summary: 'A full-stack railway monitoring platform for section-level visibility: live train tracking, conflict detection, explainable delay prediction and controller-facing recommendations.',
    features: ['Live corridor dashboard in React', 'Conflict-aware recommendations for controllers', 'Explainable delay prediction from a FastAPI ML backend', 'Firebase-backed operational data'],
    stack: ['TypeScript', 'React', 'FastAPI', 'Firebase', 'ML'],
    live: null, repo: 'trackrail', art: 'rails', theme: 'dark', featured: true,
  },
  {
    slug: 'ghostapi', cover: 'GHOSTAPI', name: 'GhostAPI', year: 2026, kind: 'Developer tools · Automation', cat: 'Tools',
    tagline: 'APIs for websites that never had one.',
    lines: ['NO API?', 'NOW THERE', 'IS ONE'],
    summary: 'GhostAPI drives browser workflows with Playwright, stores the workflow definition, records every run and exposes the result as a normal HTTP API returning clean JSON.',
    features: ['Website UI → recorded Playwright workflow → clean JSON endpoint', 'A Chrome extension recorder that builds APIs directly from any site', 'Run history, failure screenshots and workflow versioning with diff and restore', 'Hashed API keys; deployed on Google Cloud Run with Neon Postgres and Cloudflare R2'],
    stack: ['TypeScript', 'Fastify', 'Playwright', 'PostgreSQL', 'Docker'],
    live: 'https://ghostapi-eight.vercel.app/', repo: 'Ghost_Api', art: 'ghost', theme: 'dark',
  },
  {
    slug: 'mamacare', cover: 'MAMACARE', name: 'MamaCare', year: 2026, kind: 'Health · AI', cat: 'Health',
    tagline: 'AI health companion for women in India.',
    lines: ['CARE THAT', 'CALLS YOU', 'FIRST'],
    summary: 'A full-stack AI health assistant focused on maternal health and PCOS management, combining risk monitoring, a WhatsApp chatbot and automated health calls.',
    features: ['Log vitals with automatic ML risk scoring: low, moderate or high', 'Real-time risk alerts on WhatsApp to the patient and an emergency contact', 'Weekly pregnancy tips through automated AI voice calls', 'PCOS cycle tracking with high-pain alerts', 'Pregnancy week tracker from the LMP date'],
    stack: ['Python', 'ML', 'WhatsApp API', 'Firebase'],
    live: 'https://maternity-76579.web.app/', repo: 'MamaCare', art: 'pulse', theme: 'ember',
  },
  {
    slug: 'dronaconnect', cover: 'DRONACONNECT', name: 'DronaConnect', year: 2026, kind: 'Education · ERP', cat: 'Web',
    tagline: 'Attendance for a whole college, in one portal.',
    lines: ['ONE PORTAL', 'EVERY', 'CLASSROOM'],
    summary: 'A college attendance portal with separate admin, teacher and student dashboards, Firebase authentication and role-based routes. Deployed on Vercel.',
    features: ['Separate dashboards and role-based routes for admin, teacher and student', 'Subject-wise attendance tracking with monthly reports and CSV exports', 'Recharts analytics and student attendance summaries', 'Alerts for any subject below 75% attendance'],
    stack: ['React', 'Vite', 'Firebase', 'Tailwind CSS'],
    live: 'https://dronaconnect.vercel.app', repo: 'Dronaconnect', art: 'grid', theme: 'cream',
  },
  {
    slug: 'hackrons', cover: 'HACKRONS', name: 'Hackrons', year: 2026, kind: 'Web3 · Game', cat: 'Web3',
    tagline: 'Collect, trade and battle NFT warriors.',
    lines: ['PLAY.', 'BATTLE.', 'EARN.'],
    summary: 'A full-stack Web3 NFT battle game on the Polygon blockchain. Players collect, trade and battle NFT characters with MetaMask.',
    features: ['Smart contracts for NFT minting and ownership', 'A marketplace of 18+ warriors across rarity tiers', 'Turn-based AI battles with multiple game modes', 'POL token rewards, XP progression and a global leaderboard'],
    stack: ['React', 'Solidity', 'Hardhat', 'Polygon', 'MetaMask'],
    live: 'https://hackrons.vercel.app', repo: 'Hackrons', art: 'hex', theme: 'dark',
  },
  {
    slug: 'errorbuddy', cover: 'ERRORBUDDY', name: 'ErrorBuddy', year: 2026, kind: 'Python CLI · PyPI', cat: 'Tools',
    tagline: 'Runtime errors, explained like a friend would.',
    lines: ['READ THE', 'ERROR.', 'GET THE FIX.'],
    summary: 'A Python CLI published on PyPI that turns runtime errors into human-readable explanations with fixes, examples and smart hints.',
    features: ['Plain-language explanations with fixes and examples', 'Intelligent file discovery and multi-path search', 'Smart hints to shorten the debugging loop', 'Published on PyPI: pip install errorbuddy'],
    stack: ['Python', 'CLI', 'PyPI'],
    live: 'https://pypi.org/project/errorbuddy/', repo: 'errorbuddy', art: 'terminal', theme: 'cream',
  },
  {
    slug: 'healix', cover: 'HEALIX', name: 'Healix', year: 2026, kind: 'Health · Monitoring', cat: 'Health',
    tagline: 'Care that continues after discharge.',
    lines: ['HOME', 'IS PART OF', 'RECOVERY'],
    summary: 'A post-discharge patient monitoring system for tracking health metrics after leaving hospital, with a direct line between patients and their care providers.',
    features: ['Patients log health metrics after discharge', 'Providers monitor trends and step in early', 'Patient–provider communication in one place'],
    stack: ['JavaScript', 'React', 'Node.js'],
    live: 'https://healix-khaki.vercel.app', repo: 'Healix', art: 'cross', theme: 'ember',
  },
  {
    slug: 'medbridge', cover: 'MEDBRIDGE', name: 'MedBridge', year: 2026, kind: 'Health · Interoperability', cat: 'Health',
    tagline: 'Two medical vocabularies, one gateway.',
    lines: ['DUAL-CODED', 'BY', 'DESIGN'],
    summary: 'A demonstration terminology gateway that links synthetic NAMASTE concepts to synthetic ICD-11 TM2 targets through human-reviewed mappings.',
    features: ['Role-based workflows for Doctor, Expert and Admin', 'Dual-coded diagnoses and FHIR R4 Condition generation', 'Terminology release management, audit trails and live metrics', 'All data is synthetic, built for demonstration only'],
    stack: ['React', 'FastAPI', 'PostgreSQL', 'FHIR'],
    live: null, repo: 'MedBridge', art: 'bridge', theme: 'dark',
  },
  {
    slug: 'axiom', cover: 'AXIOM', name: 'AXIOM', year: 2026, kind: 'Hackathon · Optics', cat: 'Web',
    tagline: 'A virtual free-space optical communication lab.',
    lines: ['LIGHT', 'AS A', 'NETWORK'],
    summary: 'A virtual FSOC (free-space optical communication) laboratory built at a national hackathon with Team Naut IQ.',
    features: ['Interactive virtual lab for free-space optical links', 'Runs fully offline: no CDN, cloud login or optical hardware needed', 'Built with TypeScript and Next.js'],
    stack: ['TypeScript', 'Next.js', 'React'],
    live: null, repo: 'AXIOM', art: 'beam', theme: 'ember',
  },
  {
    slug: 'nexus', cover: 'NEXUS', name: 'Nexus', year: 2025, kind: 'AI · 3D avatars', cat: 'AI',
    tagline: 'An AI you can talk to, face to face.',
    lines: ['IT', 'TALKS', 'BACK'],
    summary: 'An AI chatbot with 3D avatars and voice synthesis: Ready Player Me avatars, ElevenLabs speech and Gemini for conversation.',
    features: ['3D avatars through Ready Player Me', 'Voice synthesis with ElevenLabs', 'Conversations powered by Google Gemini', 'Supabase auth with email and Google, synced across devices'],
    stack: ['React', 'Gemini', 'ElevenLabs', 'Supabase'],
    live: 'https://nexus-eight-gray.vercel.app', repo: 'Nexus', art: 'orb', theme: 'dark',
  },
  {
    slug: 'macpreview', cover: 'MACPREVIEW', name: 'MacPreview Studio', year: 2026, kind: 'macOS · Open source', cat: 'macOS',
    tagline: 'Apple Preview speed, with the tools you actually need.',
    lines: ['MARK IT', 'SIGN IT', 'SHIP IT'],
    summary: 'An open-source macOS document preview and markup app built with SwiftUI, AppKit and PDFKit.',
    features: ['Open PDFs and common image formats', 'Native PDF annotations: pen, highlight, text, shapes, arrows and redaction blocks', 'Pen Mode for drawing, signing and underlining', 'Blank canvases and PDF export'],
    stack: ['Swift', 'SwiftUI', 'AppKit', 'PDFKit'],
    live: 'https://hardikdhingra150.github.io/Mac-Preview-Studio/', repo: 'Mac-Preview-Studio', art: 'page', theme: 'cream',
  },
  {
    slug: 'chef-ai', cover: 'CHEF AI', name: 'Chef AI', year: 2026, kind: 'Sustainability · AI', cat: 'AI',
    tagline: 'Less food in the bin, more on the plate.',
    lines: ['COOK', 'WHAT YOU', 'HAVE'],
    summary: 'An AI-powered platform to reduce food waste: it tracks inventory, predicts waste patterns and suggests recipes from what is already in the kitchen.',
    features: ['AI chatbot for food-waste questions', 'Recipe generator from available ingredients', 'Inventory with expiry tracking and a camera waste scanner', 'Donation management for food banks, with analytics'],
    stack: ['React', 'Vite', 'Tailwind CSS', 'AI'],
    live: 'https://chef-ai-food-waste.vercel.app', repo: 'chef-ai-food-waste', art: 'bowl', theme: 'ember',
  },
];

export const archive = [
  ['HealthQrApp', 'Medical records behind one QR code', 'https://healthqrapp.onrender.com'],
  ['Ayunex', 'Ayurveda IP research workspace, a hackathon build', 'https://github.com/hardikdhingra150/Ayunex'],
  ['Resume Builder', 'Build a résumé in the browser', 'https://resume-builder-nu-blush.vercel.app'],
  ['Expense Tracker', 'Mobile expense tracker built with Expo', 'https://github.com/hardikdhingra150/Expense_Tracker_App'],
  ['Cineverse', 'Movie discovery app', 'https://github.com/hardikdhingra150/Cineverse'],
  ['Luna Care', 'Care app experiment', 'https://luna-care-app-9do6.vercel.app'],
  ['Document Q&A', 'Ask questions about your documents', 'https://github.com/hardikdhingra150/document-qa'],
  ['AI Agent', 'Early agent experiments in Python', 'https://github.com/hardikdhingra150/AI-Agent'],
  ['Hangman in C', 'Where it started: semester-one C', 'https://github.com/hardikdhingra150/project_c_lang-hangman-'],
];

export const skillGroups = {
  Languages: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Dart', 'Swift', 'C++', 'C', 'Java', 'Solidity', 'HTML & CSS', 'XML'],
  Frontend: ['React', 'Flutter', 'Next.js', 'Vite', 'Tailwind CSS', 'Three.js', 'SwiftUI'],
  Backend: ['Node.js', 'Express', 'FastAPI', 'Flask', 'Django', 'Fastify', 'Prisma', 'PostgreSQL', 'MySQL', 'Firebase', 'Supabase'],
  'AI & Data': ['LLMs', 'MCP', 'RAG', 'ML', 'scikit-learn', 'Ollama', 'Gemini', 'Pandas', 'NumPy', 'Playwright'],
  'Web3': ['Hardhat', 'Polygon', 'MetaMask'],
  Tools: ['Git & GitHub', 'Docker', 'Vercel', 'Google Cloud Run', 'Homebrew', 'VS Code'],
};

// Where each skill shows up (counts drive the token sizes on the Skills page)
export function projectsUsing(skill) {
  const alias = { 'HTML & CSS': ['HTML', 'CSS'], 'Git & GitHub': ['Git'], 'Tailwind CSS': ['Tailwind CSS'] };
  const keys = alias[skill] || [skill];
  return projects.filter(p => p.stack.some(s => keys.includes(s)));
}
// projects plus the internship, for token sizes and the "used in" list
export function usage(skill) {
  const list = projectsUsing(skill).map(p => ({ name: p.name, to: `/work/${p.slug}` }));
  if (internship.stack.includes(skill)) list.unshift({ name: 'CityScene Global internship', to: '/experience' });
  return list;
}

export const journey = [
  { year: '2024', when: 'Semester 1 · 2024', tag: 'Day one', title: 'Started B.Tech in Computer Science', place: 'Dronacharya College of Engineering, Gurugram', text: 'Wrote my first C programs, a hangman game in C, and my first Flask app. That was enough to get hooked.' },
  { year: '2025', when: 'Semester 2 · 2025', tag: 'Learning', title: 'Learning the web, properly', place: 'Python · JavaScript · React · Git', text: 'Went deep on HTML, CSS, JavaScript and React, picked up Git and GitHub, and finished Udemy certifications in React and Git & GitHub.' },
  { year: '2025', when: 'Semester 3 · 2025', tag: 'Hackathons', title: 'First and second place', place: 'hackCBS 9.0 · HackWithMAIT 6.0', text: '1st place at hackCBS 9.0 (SSCBS, Delhi University) in the YugabyteDB track, out of 5,000+ registrations. 2nd place at HackWithMAIT 6.0 in the ES Solutions × CompeteHub sponsored track, out of 2,500+ registrations.' },
  { year: '2026', when: 'Semester 4 · 2026', tag: 'Building', title: 'Shipped ErrorBuddy and DronaConnect', place: 'pip install errorbuddy · dronaconnect.vercel.app', text: 'Published ErrorBuddy on PyPI, a CLI that explains Python errors in plain language, and launched DronaConnect, a college attendance portal with admin, teacher and student dashboards.' },
  { year: '2026', when: 'Summer · Jun–Jul 2026', tag: 'Internship', title: 'Software Development Intern', place: 'CityScene Global Pvt. Ltd.', text: 'Contributed to five web and mobile applications across three client projects: two solar companies and an internal HRMS.' },
  { year: '2026', when: 'Semester 5 · 2026', tag: 'Hackathon', title: 'Third hackathon win', place: 'Innovortex 3.0 · TechNeeds IGDTUW at IIIT Delhi', text: '1st place out of 1,800 participants and 15 offline finalist teams. Alongside it, open-source work: SkillForge, GhostAPI and the Notchi macOS suite.' },
];

export const highlights = [
  ['3×', 'Hackathon winner · hackCBS, HackWithMAIT, Innovortex'],
  ['8.0', 'CGPA · B.Tech CSE'],
  ['5', 'Apps contributed to as an intern'],
  ['GDG', 'Organised an event as Tech Lead'],
];

export const internship = {
  role: 'Software Development Intern',
  company: 'CityScene Global Pvt. Ltd.',
  when: '1 June – 31 July 2026',
  mode: '60-day hybrid internship',
  summary: 'Contributed to five applications across three projects: mapping user flows, supporting web and mobile interface development, checking responsive layouts and form behaviour, and documenting testing observations.',
  projects: [
    { name: 'MK Solar', platform: 'Web + mobile', text: 'Dashboards, customer enquiry management, project tracking and reporting. Reviewed how project summaries, navigation and notifications worked on mobile.' },
    { name: 'Dharti Solar', platform: 'Web + mobile', text: 'Enquiry tracking and admin screens, including user management and settings. Reviewed the mobile project-creation form that captures customer, site and system details.' },
    { name: 'HRMS', platform: 'Internal mobile app', text: 'Employee workflows for attendance, check-in and check-out, profiles, and leave, travel and expense requests, with request and approval status tracking.' },
  ],
  stack: ['TypeScript', 'JavaScript', 'Flutter', 'Dart', 'XML', 'SQL', 'Prisma', 'Git & GitHub'],
};

export const education = [
  ['B.Tech, Computer Science & Engineering', 'Dronacharya College of Engineering, Gurugram', '2024 – 2028 · CGPA 8.0'],
  ['Senior Secondary (CBSE)', 'D.R.A Senior Secondary School, Bahadurgarh', '2024 · 70%'],
  ['Secondary (CBSE)', 'Brigadier Ran Singh Public School, Jhajjar', '78%'],
];
export const certificates = ['Udemy — Learn React JS the Fast Way', 'Udemy — Master Git and GitHub'];

export const bring = ['Product sense', 'Clean interfaces', 'Fast iteration', 'Clear docs', 'Honest testing'];

export const routes = [
  ['/', 'Home'], ['/work', 'Work'], ['/skills', 'Skills'], ['/experience', 'Experience'], ['/about', 'About'], ['/contact', 'Contact'],
];
