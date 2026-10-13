/*
  Animaciones del sitio: scroll suave, cortes de luz en títulos y fotos, filetes y revelados.
  Todo lento y con distancias chicas. Sólo corre si <html> tiene .motion (JS activo y sin prefers-reduced-motion);
  si no, el CSS deja todo en su estado final.
*/
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

if (document.documentElement.classList.contains('motion')) {
  gsap.registerPlugin(ScrollTrigger);
  smoothScroll();
  // Los cortes se miden con la tipografía final ya cargada
  document.fonts.ready.then(() => {
    $$('[data-cut]').forEach(cutTitle);
    ScrollTrigger.refresh();
  });
  $$('[data-reveal-cut]').forEach(cutReveal);
  spacing();
  reveals();
  parallax();
}

function smoothScroll() {
  const lenis = new Lenis({ lerp: 0.08, anchors: { offset: -40 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const header = $('.site-header');
  lenis.on('scroll', ({ scroll }: { scroll: number }) => header?.classList.toggle('is-scrolled', scroll > 40));
}

/** Corte de luz: una línea fina cruza el título y las dos mitades se juntan a su paso. */
function cutTitle(el: HTMLElement) {
  const a = $('.ct__half--a', el)!;
  const b = $('.ct__half--b', el)!;
  const light = $('.ct__light', el)!;
  const css = getComputedStyle(el);
  const ya = parseFloat(css.getPropertyValue('--ya')) / 100;
  const yb = parseFloat(css.getPropertyValue('--yb')) / 100;

  // La línea sigue el ángulo del corte (del borde izquierdo en ya al derecho en yb)
  const measure = () => {
    const angle = Math.atan2((yb - ya) * el.offsetHeight, el.offsetWidth);
    gsap.set(light, { rotation: (angle * 180) / Math.PI });
  };

  gsap.set(a, { yPercent: -14, opacity: 0 });
  gsap.set(b, { yPercent: 14, opacity: 0 });
  const tl = gsap
    .timeline({ paused: true, delay: Number(el.dataset.cutDelay || 0), onComplete: () => el.classList.add('is-done') })
    .fromTo(light, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 0)
    .to([a, b], { yPercent: 0, opacity: 1, duration: 1.5, ease: 'expo.out' }, 0.35)
    .to(light, { opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.8);

  const play = () => {
    measure();
    tl.play();
  };
  if (el.dataset.cut === 'load') play();
  else ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: play });
}

/** Foto que se abre desde un corte: se traza la línea y la imagen se abre desde ella mientras se asienta. */
function cutReveal(fig: HTMLElement) {
  const media = $('.cr__media', fig)!;
  const img = $('img', media)!;
  const line = $('.cr__line', fig)!;
  const horizontal = fig.dataset.revealCut === 'h';
  const closed = horizontal ? 'inset(50% 0% 50% 0%)' : 'inset(0% 50% 0% 50%)';

  const tl = gsap
    .timeline({ paused: true })
    .fromTo(
      line,
      horizontal ? { scaleX: 0, opacity: 1 } : { scaleY: 0, opacity: 1 },
      { ...(horizontal ? { scaleX: 1 } : { scaleY: 1 }), duration: 0.8, ease: 'power3.inOut' },
    )
    .fromTo(media, { clipPath: closed }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0.6)
    .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 2.2, ease: 'expo.out' }, 0.6)
    .to(line, { opacity: 0, duration: 0.6 }, 0.9);

  if (fig.dataset.revealTrigger === 'load') tl.delay(0.4).play();
  else ScrollTrigger.create({ trigger: fig, start: 'top 82%', once: true, onEnter: () => tl.play() });
}

/** El eyebrow del hero aparece cerrando su espaciado entre letras. */
function spacing() {
  $$('[data-spacing]').forEach((el) =>
    gsap.fromTo(
      el,
      { letterSpacing: '0.6em', opacity: 0 },
      { letterSpacing: '0.22em', opacity: 1, duration: 2.2, ease: 'expo.out', delay: 0.1 },
    ),
  );
}

/** Bloques que suben apenas al entrar; data-reveal="0.4" agrega una demora. Filetes que se trazan. */
function reveals() {
  $$('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'power3.out',
      delay: Number(el.dataset.reveal || 0),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  $$('[data-rule]').forEach((rule) => {
    gsap.fromTo(
      rule,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: rule, start: 'top 90%', once: true } },
    );
  });
}

/** Parallax suave de cada foto dentro de su marco (sólo desktop). */
function parallax() {
  gsap.matchMedia().add('(min-width: 900px)', () => {
    $$('.cr__media img').forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: { trigger: img.closest('.cr'), start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
  });
}
