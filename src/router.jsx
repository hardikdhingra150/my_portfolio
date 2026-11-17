import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { wipe } from './fx/transition';

const subs = new Set();
let current = location.pathname.replace(/\/+$/, '') || '/';

function labelFor(path) {
  if (path === '/') return 'Home';
  const seg = path.split('/').filter(Boolean);
  return seg[seg.length - 1].replace(/-/g, ' ');
}

function commit(path, push) {
  if (push) history.pushState({}, '', path);
  current = path;
  flushSync(() => subs.forEach(f => f(path)));
  window.scrollTo(0, 0);
}

export function navigate(to, { label } = {}) {
  const [path, hash] = to.split('#');
  const clean = path.replace(/\/+$/, '') || '/';
  if (clean === current) {
    if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  wipe(label || labelFor(clean), () => commit(clean, true));
}

addEventListener('popstate', () => {
  const p = location.pathname.replace(/\/+$/, '') || '/';
  wipe(labelFor(p), () => commit(p, false));
});

export function usePath() {
  const [p, set] = useState(current);
  useEffect(() => { subs.add(set); return () => subs.delete(set); }, []);
  return p;
}

export function Link({ to, label, children, onClick, ...rest }) {
  return (
    <a href={to} {...rest} onClick={e => {
      onClick?.(e);
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault(); navigate(to, { label });
    }}>{children}</a>
  );
}
