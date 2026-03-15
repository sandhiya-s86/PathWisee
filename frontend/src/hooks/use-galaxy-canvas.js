import { useEffect, useRef } from 'react';

export const useGalaxyCanvas = (canvasRef, mouseRef, isDark) => {
  const starsRef = useRef([]);
  const meteorsRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const lastMeteorTimeRef = useRef(0);
  const lastShootingStarTimeRef = useRef(0);
  const nextShootingStarDelayRef = useRef(3000);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Deep purple space + navy blue palette
    const darkColors = [
      '#ffffff', '#e0e7ff', '#c7d2fe', '#a5b4fc',
      '#818cf8', '#93c5fd', '#bfdbfe', '#ddd6fe'
    ];
    const lightColors = [
      '#1e1b4b', '#312e81', '#3730a3', '#4338ca',
      '#4f46e5', '#1e3a5f', '#1e40af'
    ];

    const initStars = () => {
      const stars = [];
      const counts = { 1: 120, 2: 80, 3: 40 };

      Object.entries(counts).forEach(([layer, count]) => {
        const z = parseInt(layer);
        for (let i = 0; i < count; i++) {
          const baseX = Math.random() * W;
          const baseY = Math.random() * H;
          const colors = isDark ? darkColors : lightColors;
          stars.push({
            x: baseX, y: baseY, baseX, baseY, z,
            radius: z === 1 ? 0.3 + Math.random() * 0.4
                  : z === 2 ? 0.7 + Math.random() * 0.6
                  : 1.2 + Math.random() * 1.0,
            opacity: z === 1 ? 0.25 + Math.random() * 0.25
                   : z === 2 ? 0.45 + Math.random() * 0.25
                   : 0.65 + Math.random() * 0.35,
            color: colors[Math.floor(Math.random() * colors.length)],
            twinkleOffset: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.01 + Math.random() * 0.02,
            vx: 0, vy: 0,
            originalX: baseX, originalY: baseY
          });
        }
      });
      starsRef.current = stars;
    };

    initStars();

    let frameCount = 0;
    const animate = () => {
      frameCount++;

      if (isDark) {
        // Deep purple-navy space
        ctx.fillStyle = '#03000f';
        ctx.fillRect(0, 0, W, H);

        // Core glow - deep purple
        const g1 = ctx.createRadialGradient(W * 0.3, H * 0.4, 0, W * 0.3, H * 0.4, W * 0.6);
        g1.addColorStop(0, 'rgba(67, 20, 117, 0.18)');
        g1.addColorStop(0.5, 'rgba(30, 27, 75, 0.1)');
        g1.addColorStop(1, 'transparent');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, W, H);

        // Secondary glow - navy blue
        const g2 = ctx.createRadialGradient(W * 0.75, H * 0.6, 0, W * 0.75, H * 0.6, W * 0.5);
        g2.addColorStop(0, 'rgba(30, 58, 138, 0.12)');
        g2.addColorStop(0.6, 'rgba(15, 23, 42, 0.06)');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, W, H);
      } else {
        // Light mode - ethereal sky
        const sky = ctx.createLinearGradient(0, 0, W * 0.3, H);
        sky.addColorStop(0, '#ede9fe');
        sky.addColorStop(0.35, '#e0e7ff');
        sky.addColorStop(0.7, '#dbeafe');
        sky.addColorStop(1, '#f0e6ff');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);
      }

      const mouse = mouseRef.current;

      // Draw stars
      starsRef.current.forEach(star => {
        const px = (mouse.x - W / 2) / W;
        const py = (mouse.y - H / 2) / H;
        const m = star.z === 1 ? 6 : star.z === 2 ? 14 : 28;
        const tx = star.baseX + px * m;
        const ty = star.baseY + py * m;
        star.x += (tx - star.x) * 0.05;
        star.y += (ty - star.y) * 0.05;

        // Mouse attraction
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140 * 0.06;
          star.vx += (dx / dist) * force;
          star.vy += (dy / dist) * force;
          star.baseX += star.vx;
          star.baseY += star.vy;
          star.vx *= 0.9;
          star.vy *= 0.9;
        }

        star.baseX += (star.originalX - star.baseX) * 0.015;
        star.baseY += (star.originalY - star.baseY) * 0.015;

        const twinkle = Math.sin(frameCount * star.twinkleSpeed + star.twinkleOffset) * 0.35 + 0.65;
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * twinkle, 0, Math.PI * 2);
        ctx.fill();

        // Glow halo for large stars
        if (star.z === 3 && isDark) {
          ctx.globalAlpha = 0.08 * twinkle;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;

      // Meteors (dark mode only, more subtle in light)
      const now = Date.now();
      if (now - lastMeteorTimeRef.current > 1500 && meteorsRef.current.length < 5) {
        const angle = (215 + Math.random() * 15) * Math.PI / 180;
        const speed = 5 + Math.random() * 5;
        const length = 60 + Math.random() * 80;
        meteorsRef.current.push({
          x: Math.random() * W, y: -20,
          length, speed, angle,
          opacity: isDark ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.2,
          width: 1 + Math.random() * 0.8,
          life: 0, maxLife: length / speed
        });
        lastMeteorTimeRef.current = now;
      }

      meteorsRef.current = meteorsRef.current.filter(meteor => {
        meteor.life++;
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        if (meteor.x > W + 100 || meteor.y > H + 100 || meteor.life > meteor.maxLife) return false;

        const grad = ctx.createLinearGradient(
          meteor.x, meteor.y,
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length
        );
        const headColor = isDark ? `rgba(200, 210, 255, ${meteor.opacity})` : `rgba(99, 102, 241, ${meteor.opacity})`;
        grad.addColorStop(0, headColor);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = meteor.width * (1 - meteor.life / meteor.maxLife);
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length
        );
        ctx.stroke();
        return true;
      });

      // Shooting stars
      if (now - lastShootingStarTimeRef.current > nextShootingStarDelayRef.current && shootingStarsRef.current.length < 2) {
        const pairs = isDark
          ? [['#a78bfa', '#38bdf8'], ['#c084fc', '#67e8f9'], ['#818cf8', '#22d3ee']]
          : [['#6366f1', '#0ea5e9'], ['#8b5cf6', '#06b6d4']];
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        const angle = (-15 - Math.random() * 25) * Math.PI / 180;
        shootingStarsRef.current.push({
          x: Math.random() * W, y: Math.random() * H * 0.3,
          angle, speed: 10 + Math.random() * 8,
          length: 100 + Math.random() * 60,
          starColor: pair[0], trailColor: pair[1],
          progress: 0
        });
        lastShootingStarTimeRef.current = now;
        nextShootingStarDelayRef.current = 3000 + Math.random() * 2000;
      }

      shootingStarsRef.current = shootingStarsRef.current.filter(star => {
        star.progress += 0.008;
        const hx = star.x + Math.cos(star.angle) * star.speed * star.progress * 100;
        const hy = star.y + Math.sin(star.angle) * star.speed * star.progress * 100;
        if (star.progress >= 1) return false;

        const grad = ctx.createLinearGradient(
          hx - Math.cos(star.angle) * star.length,
          hy - Math.sin(star.angle) * star.length,
          hx, hy
        );
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.4, star.trailColor);
        grad.addColorStop(1, star.starColor);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isDark ? 2.5 : 2;
        ctx.beginPath();
        ctx.moveTo(
          hx - Math.cos(star.angle) * star.length,
          hy - Math.sin(star.angle) * star.length
        );
        ctx.lineTo(hx, hy);
        ctx.stroke();
        return true;
      });

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    resizeObserverRef.current = new ResizeObserver(() => {
      const oldW = W;
      const oldH = H;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      starsRef.current.forEach(star => {
        star.baseX = (star.baseX / oldW) * W;
        star.baseY = (star.baseY / oldH) * H;
        star.originalX = star.baseX;
        star.originalY = star.baseY;
        star.x = star.baseX;
        star.y = star.baseY;
      });
    });

    resizeObserverRef.current.observe(canvas);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, [canvasRef, mouseRef, isDark]);
};
