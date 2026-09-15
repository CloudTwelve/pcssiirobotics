// Initialize particles only for users who have not requested reduced motion.
const initializeParticles = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const particlesRoot = document.getElementById('particles-js');
  if (!particlesRoot || !window.particlesJS) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  window.particlesJS.load('particles-js', 'particles.json');
};

if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(initializeParticles, { timeout: 1200 });
  } else {
    window.setTimeout(initializeParticles, 0);
  }
}
