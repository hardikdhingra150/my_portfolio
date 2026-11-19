import React, { useState } from 'react';
import { me } from '../data';
import { Link } from '../router';
import { Wipe, Arrow, AsciiArt, CharField, useClock, useTitle } from '../ui';

export default function Contact() {
  useTitle('Contact');
  const time = useClock(), [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(me.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }); };
  return (
    <section className="contact">
      <CharField />
      <div className="ct-in">
        <div className="ph-meta mono"><span>06 — Contact</span><span><i className="dot" />{me.available}</span></div>
        <h1 className="ct-word"><Wipe text="SAY HELLO" fit maxH={.28} step={.05} /></h1>
        <div className="ct-grid">
          <div className="ct-mail rv">
            <span className="mono">The fastest way to reach me</span>
            <a href={`mailto:${me.email}`} className="mail" data-cursor="Write">{me.email}</a>
            <button className={`btn small ${copied ? 'ok' : ''}`} onClick={copy}>{copied ? 'Copied ✓' : 'Copy address'}</button>
          </div>
          <div className="ct-links rv" style={{ '--i': 1 }}>
            <a href={me.linkedin} target="_blank" rel="noreferrer"><span>LinkedIn</span><Arrow /></a>
            <a href={me.github} target="_blank" rel="noreferrer"><span>GitHub</span><Arrow /></a>
            <a href="https://pypi.org/project/errorbuddy/" target="_blank" rel="noreferrer"><span>PyPI</span><Arrow /></a>
            <a href={me.resume} target="_blank" rel="noreferrer"><span>Résumé (PDF)</span><Arrow d="down" /></a>
          </div>
          <div className="ct-time rv" style={{ '--i': 2 }}>
            <span className="mono">My local time</span>
            <strong>{time}</strong>
            <span className="dim">{me.city}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NotFound() {
  useTitle('Lost');
  return (
    <section className="nf">
      <AsciiArt scene="ghost" ramp="ember" cell={[9, 13]} className="nf-art" />
      <h1 className="ph-word"><Wipe text="404" /></h1>
      <p>This page wandered off. It happens to the best of us.</p>
      <Link to="/" className="btn solid">Take me home <Arrow d="e" /></Link>
    </section>
  );
}
