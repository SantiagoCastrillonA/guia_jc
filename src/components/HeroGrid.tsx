import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import styles from './HeroGrid.module.css';

/** Malla de puntos que respira detrás del hero. Canvas 2D, sin librerías. */
export function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let ancho = 0;
    let alto = 0;
    let puntos: { x: number; y: number; vx: number; vy: number }[] = [];
    const puntero = { x: -999, y: -999 };

    const medir = () => {
      const rect = canvas.getBoundingClientRect();
      ancho = rect.width;
      alto = rect.height;
      canvas.width = ancho * dpr;
      canvas.height = alto * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cuantos = Math.min(64, Math.round((ancho * alto) / 16000));
      puntos = Array.from({ length: cuantos }, () => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }));
    };

    const leerColor = (nombre: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(nombre).trim() || '#9184d9';

    const acento = leerColor('--color-accent');
    const tech = leerColor('--color-tech');

    const dibujar = () => {
      ctx.clearRect(0, 0, ancho, alto);

      for (const p of puntos) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = acento;
        ctx.globalAlpha = 0.55;
        ctx.fill();
      }

      for (let i = 0; i < puntos.length; i++) {
        for (let j = i + 1; j < puntos.length; j++) {
          const a = puntos[i];
          const b = puntos[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > 118) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = d < 70 ? tech : acento;
          ctx.globalAlpha = (1 - d / 118) * 0.28;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const mover = () => {
      for (const p of puntos) {
        // El puntero empuja suavemente los puntos cercanos.
        const dx = p.x - puntero.x;
        const dy = p.y - puntero.y;
        const d = Math.hypot(dx, dy);
        if (d < 120 && d > 0.01) {
          p.x += (dx / d) * 0.5;
          p.y += (dy / d) * 0.5;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > ancho) p.vx *= -1;
        if (p.y < 0 || p.y > alto) p.vy *= -1;
      }
    };

    medir();
    dibujar(); // un primer cuadro aunque la pestaña esté en segundo plano

    if (reduce) return;

    let raf = 0;
    const bucle = () => {
      if (!document.hidden) {
        mover();
        dibujar();
      }
      raf = requestAnimationFrame(bucle);
    };
    raf = requestAnimationFrame(bucle);

    const onPuntero = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      puntero.x = e.clientX - rect.left;
      puntero.y = e.clientY - rect.top;
    };
    const onSalir = () => {
      puntero.x = -999;
      puntero.y = -999;
    };
    const observer = new ResizeObserver(medir);
    observer.observe(canvas);
    window.addEventListener('pointermove', onPuntero, { passive: true });
    window.addEventListener('pointerleave', onSalir);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onPuntero);
      window.removeEventListener('pointerleave', onSalir);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
