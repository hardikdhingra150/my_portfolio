import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { usePath } from './router';
import { Nav, Footer, Cursor, Palette } from './ui';
import { playIntro } from './fx/loader';
import Home from './pages/Home';
import { Work, Project } from './pages/Work';
import Skills from './pages/Skills';
import Experience from './pages/Experience';
import About from './pages/About';
import Now from './pages/Now';
import Contact, { NotFound } from './pages/Contact';
import { projects } from './data';

function pick(path) {
  if (path === '/') return <Home />;
  if (path === '/work') return <Work />;
  const m = path.match(/^\/work\/([\w-]+)$/);
  if (m) return projects.some(p => p.slug === m[1]) ? <Project slug={m[1]} /> : <NotFound />;
  return { '/skills': <Skills />, '/experience': <Experience />, '/about': <About />, '/now': <Now />, '/contact': <Contact /> }[path] || <NotFound />;
}

function App() {
  const path = usePath(), [pal, setPal] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    const t = setTimeout(() => document.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el)), 40);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [path]);
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Cursor />
      <Nav openPalette={() => setPal(true)} />
      <main id="main" key={path} className="page">{pick(path)}</main>
      {path !== '/contact' && <Footer />}
      <Palette open={pal} setOpen={setPal} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
playIntro({ onReveal: () => document.documentElement.classList.add('revealed'), onDone: () => {} });
