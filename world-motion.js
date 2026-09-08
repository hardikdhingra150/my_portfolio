(() => {
  const video = document.getElementById('world-video');
  const toggle = document.getElementById('motion-control');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  const applyMotion = () => {
    document.body.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? '▶ Play motion' : 'Ⅱ Pause motion';
    if (paused || document.hidden) video.pause();
    else video.play().catch(() => {
      paused = true;
      document.body.classList.add('motion-paused');
      toggle.setAttribute('aria-pressed', 'true');
      toggle.textContent = '▶ Play motion';
    });
  };
  toggle.addEventListener('click', () => { paused = !paused; applyMotion(); });
  reduced.addEventListener('change', event => { paused = event.matches; applyMotion(); });
  document.addEventListener('visibilitychange', applyMotion);
  video.addEventListener('error', () => document.body.classList.add('video-unavailable'));
  video.querySelector('source').addEventListener('error', () => document.body.classList.add('video-unavailable'));
  applyMotion();
  document.body.classList.add('motion-ready');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (paused || !finePointer.matches) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--tilt-y', `${((event.clientX - r.left) / r.width - .5) * 12}deg`);
      card.style.setProperty('--tilt-x', `${(.5 - (event.clientY - r.top) / r.height) * 10}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');card.style.setProperty('--tilt-y', '0deg');
    });
  });
  const progress = document.querySelector('.scroll-progress');
  let frame = 0;
  const updateScroll = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
    frame = 0;
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateScroll); }, {passive:true});
  window.addEventListener('resize', updateScroll);
  updateScroll();
})();
